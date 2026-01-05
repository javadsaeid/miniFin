package com.miniFin.minFin.audit_dashboard.service;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.account.repo.AccountRepo;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.auth_users.repo.UserRepo;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import com.miniFin.minFin.transaction.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {
    private final UserRepo userRepo;
    private final TransactionRepo transactionRepo;
    private final AccountRepo accountRepo;
    private final ModelMapper modelMapper;


    @Override
    public Map<String, Long> getSystemTotals() {
        long totalUser = userRepo.count();
        long accountTotal = accountRepo.count();
        long transactionTotal = transactionRepo.count();

        return Map.of(
                "totalUsers", totalUser,
                "totalAccounts", accountTotal,
                "totalTransactions", transactionTotal
        );
    }

    @Override
    public Optional<UserDTO> findUserByEmail(String email) {
        return userRepo.findByEmail(email).map(u -> modelMapper.map(u, UserDTO.class));
    }

    @Override
    public Optional<AccountDTO> findAccountByAccountNumber(String accountNumber) {
        return accountRepo.findByAccountNumber(accountNumber).map(u -> modelMapper.map(u, AccountDTO.class));
    }

    @Override
    public List<TransactionDTO> findTransactionByAccountNumber(String accountNumber) {
        return transactionRepo.findByAccount_AccountNumber(accountNumber).stream()
                .map(u -> modelMapper.map(u, TransactionDTO.class)).collect(Collectors.toList());
    }

    @Override
    public Optional<TransactionDTO> findTransactionById(Long transactionId) {
        return transactionRepo.findById(transactionId).map(u -> modelMapper.map(u, TransactionDTO.class));
    }
}
