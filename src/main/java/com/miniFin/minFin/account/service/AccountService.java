package com.miniFin.minFin.account.service;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.enums.AccountType;
import com.miniFin.minFin.res.Response;

import java.util.List;

public interface AccountService {
    Account createAccount(AccountType accountType, User user);
    Response<List<AccountDTO>> getMyAccounts();
    Response<?> closeAccount(String accountNumber);
}
