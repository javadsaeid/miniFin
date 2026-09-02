package com.miniFin.minFin.account.controller;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.account.service.AccountService;
import com.miniFin.minFin.res.Response;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Accounts", description = "User account management endpoints")
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/me")
    @Operation(summary = "Get my accounts", description = "Returns all accounts belonging to the currently authenticated user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of accounts returned successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<Response<List<AccountDTO>>> myAccounts() {
        return ResponseEntity.ok(accountService.getMyAccounts());
    }

    @DeleteMapping("/close/{accountNumber}")
    @Operation(summary = "Close an account", description = "Closes the specified account. The account must belong to the authenticated user.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Account closed successfully"),
        @ApiResponse(responseCode = "401", description = "Not authenticated"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<Response<?>> closeAccount(
            @Parameter(description = "The account number to close") @PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.closeAccount(accountNumber));
    }

}
