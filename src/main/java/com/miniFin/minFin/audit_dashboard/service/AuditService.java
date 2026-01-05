package com.miniFin.minFin.audit_dashboard.service;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface AuditService {
    Map<String, Long> getSystemTotals();
    Optional<UserDTO> findUserByEmail(String email);
    Optional<AccountDTO> findAccountByAccountNumber(String accountNumber);
    List<TransactionDTO> findTransactionByAccountNumber(String accountNumber);
    Optional<TransactionDTO> findTransactionById(Long transactionId);
}
