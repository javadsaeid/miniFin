package com.miniFin.minFin.account.service;

import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.enums.AccountType;

public interface AccountService {
    Account createAccount(AccountType accountType, User user);
}
