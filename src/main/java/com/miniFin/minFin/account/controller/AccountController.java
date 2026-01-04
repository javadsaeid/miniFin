package com.miniFin.minFin.account.controller;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.account.service.AccountService;
import com.miniFin.minFin.res.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<Response<List<AccountDTO>>> myAccounts() {
        return ResponseEntity.ok(accountService.getMyAccounts());
    }

    @DeleteMapping("/close/{accountNumber}")
    public ResponseEntity<Response<?>> closeAccount(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.closeAccount(accountNumber));
    }

}
