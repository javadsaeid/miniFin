package com.miniFin.minFin.transaction.service;

import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.account.repo.AccountRepo;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.auth_users.service.UserService;
import com.miniFin.minFin.enums.*;
import com.miniFin.minFin.exceptions.InsufficientBalanceException;
import com.miniFin.minFin.notification.service.NotificationService;
import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import com.miniFin.minFin.transaction.dtos.TransactionRequest;
import com.miniFin.minFin.transaction.entity.Transaction;
import com.miniFin.minFin.transaction.repo.TransactionRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionRepo transactionRepo;
    @Mock
    private AccountRepo accountRepo;
    @Mock
    private NotificationService notificationService;
    @Mock
    private UserService userService;
    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private User user;
    private Account account;
    private TransactionRequest depositRequest;
    private TransactionRequest withdrawRequest;
    private TransactionRequest transferRequest;
    private Account destAccount;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .build();

        account = Account.builder()
                .id(1L)
                .accountNumber("6612345678")
                .accountType(AccountType.SAVING)
                .accountStatus(AccountStatus.ACTIVE)
                .balance(new BigDecimal("1000.00"))
                .currency(Currency.USD)
                .user(user)
                .build();

        destAccount = Account.builder()
                .id(2L)
                .accountNumber("6687654321")
                .accountType(AccountType.SAVING)
                .accountStatus(AccountStatus.ACTIVE)
                .balance(new BigDecimal("500.00"))
                .currency(Currency.USD)
                .user(user)
                .build();

        depositRequest = new TransactionRequest();
        depositRequest.setTransactionType(TransactionType.DEPOSIT);
        depositRequest.setAmount(new BigDecimal("200.00"));
        depositRequest.setAccountNumber("6612345678");
        depositRequest.setDescription("Deposit test");

        withdrawRequest = new TransactionRequest();
        withdrawRequest.setTransactionType(TransactionType.WITHDRAW);
        withdrawRequest.setAmount(new BigDecimal("100.00"));
        withdrawRequest.setAccountNumber("6612345678");
        withdrawRequest.setDescription("Withdraw test");

        transferRequest = new TransactionRequest();
        transferRequest.setTransactionType(TransactionType.TRANSFER);
        transferRequest.setAmount(new BigDecimal("300.00"));
        transferRequest.setAccountNumber("6612345678");
        transferRequest.setDestinationAccountNumber("6687654321");
        transferRequest.setDescription("Transfer test");
    }

    @Test
    void createTransaction_deposit_success() {
        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(account));

        Response<?> response = transactionService.createTransaction(depositRequest);

        assertEquals(201, response.getStatusCode());
        assertEquals("Transaction Created", response.getMessage());
        assertEquals(new BigDecimal("1200.00"), account.getBalance());
        verify(transactionRepo).save(any(Transaction.class));
        verify(notificationService).sendEmail(any(), any());
    }

    @Test
    void createTransaction_withdraw_success() {
        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(account));

        Response<?> response = transactionService.createTransaction(withdrawRequest);

        assertEquals(201, response.getStatusCode());
        assertEquals("Transaction Created", response.getMessage());
        verify(transactionRepo).save(any(Transaction.class));
        verify(notificationService).sendEmail(any(), any());
    }

    @Test
    void createTransaction_withdraw_insufficientBalance_throwsInsufficientBalanceException() {
        TransactionRequest largeWithdraw = new TransactionRequest();
        largeWithdraw.setTransactionType(TransactionType.WITHDRAW);
        largeWithdraw.setAmount(new BigDecimal("5000.00"));
        largeWithdraw.setAccountNumber("6612345678");
        largeWithdraw.setDescription("Large withdraw test");

        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(account));

        assertThrows(InsufficientBalanceException.class,
                () -> transactionService.createTransaction(largeWithdraw));
        verify(transactionRepo, never()).save(any());
    }

    @Test
    void createTransaction_transfer_success() {
        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(account));
        when(accountRepo.findByAccountNumber("6687654321")).thenReturn(Optional.of(destAccount));

        Response<?> response = transactionService.createTransaction(transferRequest);

        assertEquals(201, response.getStatusCode());
        assertEquals("Transaction Created", response.getMessage());
        verify(accountRepo, times(2)).save(any(Account.class));
        verify(notificationService, atLeastOnce()).sendEmail(any(), any());
    }

    @Test
    void createTransaction_transfer_insufficientBalance_throwsInsufficientBalanceException() {
        TransactionRequest largeTransfer = new TransactionRequest();
        largeTransfer.setTransactionType(TransactionType.TRANSFER);
        largeTransfer.setAmount(new BigDecimal("5000.00"));
        largeTransfer.setAccountNumber("6612345678");
        largeTransfer.setDestinationAccountNumber("6687654321");
        largeTransfer.setDescription("Large transfer test");

        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(account));
        when(accountRepo.findByAccountNumber("6687654321")).thenReturn(Optional.of(destAccount));

        assertThrows(InsufficientBalanceException.class,
                () -> transactionService.createTransaction(largeTransfer));
        verify(accountRepo, never()).save(any());
    }

    @Test
    void getTransactionsForMyAccount_returnsPaginatedResults() {
        Transaction transaction = Transaction.builder()
                .id(1L)
                .amount(new BigDecimal("100.00"))
                .transactionType(TransactionType.DEPOSIT)
                .transactionDateTime(LocalDateTime.now())
                .description("Test transaction")
                .status(TransactionalStatus.SUCCESS)
                .account(account)
                .build();

        TransactionDTO transactionDTO = new TransactionDTO();
        transactionDTO.setId(1L);
        transactionDTO.setAmount(new BigDecimal("100.00"));
        transactionDTO.setTransactionType(TransactionType.DEPOSIT);

        Page<Transaction> transactionPage = new PageImpl<>(List.of(transaction),
                PageRequest.of(0, 10, Sort.by("transactionDateTime").descending()), 1);

        when(userService.getCurrentLoggedInUser()).thenReturn(user);
        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(account));
        when(transactionRepo.findByAccount_AccountNumber(eq("6612345678"), any(PageRequest.class)))
                .thenReturn(transactionPage);
        when(modelMapper.map(transaction, TransactionDTO.class)).thenReturn(transactionDTO);

        Response<List<TransactionDTO>> response = transactionService.getTransactionsForMyAccount("6612345678", 0, 10);

        assertEquals(200, response.getStatusCode());
        assertEquals("Transaction List retrieved", response.getMessage());
        assertEquals(1, response.getData().size());
        assertNotNull(response.getMetaData());
    }
}
