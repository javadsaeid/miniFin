package com.miniFin.minFin.account.service;

import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.account.repo.AccountRepo;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.enums.AccountType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements AccountService {
    private final AccountRepo accountRepo;

    @Override
    public Account createAccount(AccountType accountType, User user) {
        return null;
    }
}
