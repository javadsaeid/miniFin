package com.miniFin.minFin.transaction.controller;

import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import com.miniFin.minFin.transaction.dtos.TransactionRequest;
import com.miniFin.minFin.transaction.entity.Transaction;
import com.miniFin.minFin.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Response<List<TransactionDTO>>> getMyTransactions(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(transactionService.getTransactionsForMyAccount(accountNumber, page, size));
    }

    @PostMapping
    public ResponseEntity<Response<?>> createTransaction(@RequestBody @Valid TransactionRequest transactionRequest) {
        return ResponseEntity.ok(transactionService.createTransaction(transactionRequest));
    }
}
