package com.miniFin.minFin.account.repo;

import com.miniFin.minFin.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepo extends JpaRepository<Account, Long> {
    Account findByUserId(Long userId);
    Account findByAccountNumber(String accountNumber);
}
