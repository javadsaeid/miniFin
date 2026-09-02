package com.miniFin.minFin.audit_dashboard.controller;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.audit_dashboard.service.AuditService;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Audit Dashboard", description = "Admin and auditor endpoints for system monitoring and auditing")
public class AuditController {
    private final AuditService auditService;

    @GetMapping("/totals")
    @Operation(summary = "Get system totals", description = "Returns aggregate counts of users, accounts, and transactions")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "System totals returned successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN or AUDITOR authority required")
    })
    public ResponseEntity<Map<String, Long>> getTotals() {
        return ResponseEntity.ok(auditService.getSystemTotals());
    }

    @GetMapping("/users")
    @Operation(summary = "Find user by email", description = "Searches for a user by their email address")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User found and returned"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN or AUDITOR authority required"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserDTO> getUsers(
            @Parameter(description = "The email address to search for") @RequestParam String email) {
        Optional<UserDTO> userDTO = auditService.findUserByEmail(email);
        return userDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/accounts")
    @Operation(summary = "Find account by account number", description = "Searches for an account by its account number")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Account found and returned"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN or AUDITOR authority required"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<AccountDTO> getAccounts(
            @Parameter(description = "The account number to search for") @RequestParam String accountNumber) {
        Optional<AccountDTO> accountDTO = auditService.findAccountByAccountNumber(accountNumber);
        return accountDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/transactions/by-accountNumber")
    @Operation(summary = "Find transactions by account number", description = "Returns all transactions for the specified account number")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Transactions found and returned"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN or AUDITOR authority required"),
        @ApiResponse(responseCode = "404", description = "No transactions found for the given account number")
    })
    public ResponseEntity<List<TransactionDTO>> getTransactionsByAccountNumber(
            @Parameter(description = "The account number to search transactions for") @RequestParam String accountNumber) {
        List<TransactionDTO> transactionDTOS = auditService.findTransactionByAccountNumber(accountNumber);
        if (transactionDTOS.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(transactionDTOS);
    }

    @GetMapping("/transactions/by-id")
    @Operation(summary = "Find transaction by ID", description = "Returns a single transaction by its ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Transaction found and returned"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN or AUDITOR authority required"),
        @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    public ResponseEntity<TransactionDTO> getTransactionsById(
            @Parameter(description = "The transaction ID to search for") @RequestParam Long id) {
        Optional<TransactionDTO> transactionDTOS = auditService.findTransactionById(id);
        return transactionDTOS.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/all-users")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Get all users (Admin)", description = "Returns a paginated list of all users. Requires ADMIN authority.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of users returned successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN authority required")
    })
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(auditService.getAllUsers(page, size));
    }

    @GetMapping("/all-accounts")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Get all accounts (Admin)", description = "Returns a paginated list of all accounts. Requires ADMIN authority.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of accounts returned successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN authority required")
    })
    public ResponseEntity<List<AccountDTO>> getAllAccounts(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(auditService.getAllAccounts(page, size));
    }

    @GetMapping("/all-transactions")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Get all transactions (Admin)", description = "Returns a paginated list of all transactions. Requires ADMIN authority.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of transactions returned successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN authority required")
    })
    public ResponseEntity<List<TransactionDTO>> getAllTransactions(
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(auditService.getAllTransactions(page, size));
    }
}
