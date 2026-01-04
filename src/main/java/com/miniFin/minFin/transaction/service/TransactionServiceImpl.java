package com.miniFin.minFin.transaction.service;

import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.account.repo.AccountRepo;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.auth_users.service.UserService;
import com.miniFin.minFin.enums.TransactionType;
import com.miniFin.minFin.enums.TransactionalStatus;
import com.miniFin.minFin.exceptions.BadRequestException;
import com.miniFin.minFin.exceptions.InsufficientBalanceException;
import com.miniFin.minFin.exceptions.InvalidTransactionException;
import com.miniFin.minFin.exceptions.NotFoundException;
import com.miniFin.minFin.notification.dtos.NotificationDTO;
import com.miniFin.minFin.notification.service.NotificationService;
import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import com.miniFin.minFin.transaction.dtos.TransactionRequest;
import com.miniFin.minFin.transaction.entity.Transaction;
import com.miniFin.minFin.transaction.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepo transactionRepo;
    private final AccountRepo accountRepo;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ModelMapper modelMapper;


    @Override
    @Transactional
    public Response<?> createTransaction(TransactionRequest transactionRequest) {
        Transaction transaction = new Transaction();
        transaction.setTransactionType(transactionRequest.getTransactionType());
        transaction.setAmount(transactionRequest.getAmount());
        transaction.setDescription(transactionRequest.getDescription());

        switch (transaction.getTransactionType()) {
            case DEPOSIT -> handleDeposit(transactionRequest, transaction);
            case WITHDRAW -> handleWithdraw(transactionRequest, transaction);
            case TRANSFER -> handleTransfer(transactionRequest, transaction);
            default -> throw new InvalidTransactionException("Invalid transaction type");
        }

        transaction.setStatus(TransactionalStatus.SUCCESS);
        transactionRepo.save(transaction);

        // send transaction notification
        sendTransactionNotification(transaction);

        return Response.builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Transaction Created")
                .build();
    }

    @Override
    public Response<List<TransactionDTO>> getTransactionsForMyAccount(String accountNumber, int page, int size) {
        User user = userService.getCurrentLoggedInUser();
        Account myAccount = accountRepo.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new NotFoundException("Account not found"));

        if (!myAccount.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Account not to the authenticated user");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDateTime").descending());
        Page<Transaction> transactions = transactionRepo.findByAccount_AccountNumber(accountNumber, pageable);
        List<TransactionDTO> transactionDTOS = transactions
                .getContent()
                .stream()
                .map(transaction -> modelMapper.map(transaction, TransactionDTO.class)).toList();


        return Response.<List<TransactionDTO>>builder()
                .data(transactionDTOS)
                .statusCode(HttpStatus.OK.value())
                .message("Transaction List retrieved")
                .metaData(
                        Map.of(
                                "currentPage", transactions.getNumber(),
                                "totalItem", transactions.getTotalElements(),
                                "totalPages", transactions.getTotalPages()
                        )
                )
                .build();
    }

    private void handleDeposit(TransactionRequest transactionRequest, Transaction transaction) {
        Account account = accountRepo.findByAccountNumber(transactionRequest.getAccountNumber())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        account.setBalance(account.getBalance().add(transactionRequest.getAmount()));
        transaction.setAccount(account);
        transactionRepo.save(transaction);
    }

    private void handleWithdraw(TransactionRequest transactionRequest, Transaction transaction) {
        Account account = accountRepo.findByAccountNumber(transactionRequest.getAccountNumber())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        if (account.getBalance().compareTo(transactionRequest.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        transaction.setAccount(account);
        transactionRepo.save(transaction);
    }

    private void handleTransfer(TransactionRequest transactionRequest, Transaction transaction) {
        Account account = accountRepo.findByAccountNumber(transactionRequest.getAccountNumber())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        Account destAccount = accountRepo.findByAccountNumber(transactionRequest.getDestinationAccountNumber())
                .orElseThrow(() -> new NotFoundException("Destination account not found"));

        if (account.getBalance().compareTo(transactionRequest.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        // deduct from source
        account.setBalance(account.getBalance().subtract(transactionRequest.getAmount()));
        accountRepo.save(account);

        // add to destination
        destAccount.setBalance(destAccount.getBalance().add(transactionRequest.getAmount()));
        accountRepo.save(destAccount);

        transaction.setAccount(destAccount);
        transaction.setSourceAccount(account.getAccountNumber());
        transaction.setDestinationAccount(account.getAccountNumber());
        transactionRepo.save(transaction);
    }

    private void sendTransactionNotification(Transaction transaction) {
        User user = transaction.getAccount().getUser();
        String subject;
        String template;

        Map<String, Object> templateVars = new HashMap<>();
        templateVars.put("name", user.getFirstName());
        templateVars.put("amount", transaction.getAmount());
        templateVars.put("accountNumber", transaction.getAccount().getAccountNumber());
        templateVars.put("date", transaction.getTransactionDateTime().toString());
        templateVars.put("balance", transaction.getAccount().getBalance());

        if (transaction.getTransactionType() == TransactionType.DEPOSIT) {
            template = "credit-alert";
            subject = "Credit Alert";
            handleSendEmail(user, subject, template, templateVars);
        } else if (transaction.getTransactionType() == TransactionType.WITHDRAW) {
            template = "debit-alert";
            subject = "Debit Alert";
            handleSendEmail(user, subject, template, templateVars);
        } else if (transaction.getTransactionType() == TransactionType.TRANSFER) {
            template = "debit-alert";
            subject = "Transfer Alert";
            handleSendEmail(user, subject, template, templateVars);

            // create alert for recipient
            Account destAccount = accountRepo.findByAccountNumber(transaction.getDestinationAccount())
                    .orElseThrow(() -> new NotFoundException("Destination account not found"));

            User destUser = destAccount.getUser();
            Map<String, Object> recVars = new HashMap<>();
            recVars.put("name", destUser.getFirstName());
            recVars.put("amount", transaction.getAmount());
            recVars.put("accountNumber", destAccount.getAccountNumber());
            recVars.put("date", transaction.getTransactionDateTime().toString());
            recVars.put("balance", destAccount.getBalance());

            handleSendEmail(destUser, "Credit Alert", "credit-alert", recVars);
        }
    }

    private void handleSendEmail(User user, String subject, String template, Map<String, Object> templateVars) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(user.getEmail())
                .subject(subject)
                .templateName(template)
                .templateVariables(templateVars)
                .build();

        notificationService.sendEmail(notificationDTO, user);
    }

}
