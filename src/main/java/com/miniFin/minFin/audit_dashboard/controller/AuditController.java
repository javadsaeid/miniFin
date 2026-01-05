package com.miniFin.minFin.audit_dashboard.controller;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.audit_dashboard.service.AuditService;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/audit")
@PreAuthorize("hasAnyAuthority('ADMIN') or hasAnyAuthority('AUDITOR')")
public class AuditController {
    private final AuditService auditService;

    @GetMapping("/totals")
    public ResponseEntity<Map<String, Long>> getTotals() {
        return ResponseEntity.ok(auditService.getSystemTotals());
    }

    @GetMapping("/users")
    public ResponseEntity<UserDTO> getUsers(@RequestParam String email) {
        Optional<UserDTO> userDTO = auditService.findUserByEmail(email);
        // different approach to handle not found user.
        return userDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/accounts")
    public ResponseEntity<AccountDTO> getAccounts(@RequestParam String accountNumber) {
        Optional<AccountDTO> accountDTO = auditService.findAccountByAccountNumber(accountNumber);
        // different approach to handle not found user.
        return accountDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/transactions/by-accountNumber")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByAccountNumber(@RequestParam String accountNumber) {
        List<TransactionDTO> transactionDTOS = auditService.findTransactionByAccountNumber(accountNumber);

        if (transactionDTOS.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(transactionDTOS);
    }

    @GetMapping("/transactions/by-id")
    public ResponseEntity<TransactionDTO> getTransactionsById(@RequestParam Long id) {
        Optional<TransactionDTO> transactionDTOS = auditService.findTransactionById(id);
        // different approach to handle not found user.
        return transactionDTOS.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

}
