package com.miniFin.minFin.config;

import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.account.repo.AccountRepo;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.auth_users.repo.UserRepo;
import com.miniFin.minFin.enums.*;
import com.miniFin.minFin.role.entity.Role;
import com.miniFin.minFin.role.repo.RoleRepo;
import com.miniFin.minFin.transaction.entity.Transaction;
import com.miniFin.minFin.transaction.repo.TransactionRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepo roleRepo;
    private final UserRepo userRepo;
    private final AccountRepo accountRepo;
    private final TransactionRepo transactionRepo;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepo.count() > 0) {
            log.info("Data already seeded, skipping initialization");
            return;
        }

        log.info("Seeding demo data...");

        Role adminRole = createRole("ADMIN");
        Role customerRole = createRole("CUSTOMER");
        Role auditorRole = createRole("AUDITOR");

        // Demo login users
        User admin = createUser("Admin", "User", "admin@minifin.com", "admin123", List.of(adminRole));
        User customer = createUser("John", "Doe", "customer@minifin.com", "customer123", List.of(customerRole));
        User auditor = createUser("Jane", "Smith", "auditor@minifin.com", "auditor123", List.of(auditorRole));

        // Extra customers
        User alice = createUser("Alice", "Johnson", "alice@minifin.com", "password123", List.of(customerRole));
        User bob = createUser("Bob", "Williams", "bob@minifin.com", "password123", List.of(customerRole));
        User carol = createUser("Carol", "Brown", "carol@minifin.com", "password123", List.of(customerRole));
        User dave = createUser("Dave", "Miller", "dave@minifin.com", "password123", List.of(customerRole));
        User eve = createUser("Eve", "Davis", "eve@minifin.com", "password123", List.of(customerRole));
        User frank = createUser("Frank", "Garcia", "frank@minifin.com", "password123", List.of(customerRole));
        User grace = createUser("Grace", "Martinez", "grace@minifin.com", "password123", List.of(customerRole));

        // Accounts
        Account adminAccount = createAccount(admin, new BigDecimal("5000.00"), AccountType.SAVING);
        Account customerSaving = createAccount(customer, new BigDecimal("10000.00"), AccountType.SAVING);
        Account customerCurrent = createAccount(customer, new BigDecimal("2500.00"), AccountType.CURRENT);
        Account auditorAccount = createAccount(auditor, new BigDecimal("7500.00"), AccountType.SAVING);

        Account aliceSaving = createAccount(alice, new BigDecimal("15200.50"), AccountType.SAVING);
        Account aliceCurrent = createAccount(alice, new BigDecimal("3400.75"), AccountType.CURRENT);
        Account bobSaving = createAccount(bob, new BigDecimal("8900.00"), AccountType.SAVING);
        Account bobCurrent = createAccount(bob, new BigDecimal("1200.00"), AccountType.CURRENT);
        Account carolSaving = createAccount(carol, new BigDecimal("22000.00"), AccountType.SAVING);
        Account daveSaving = createAccount(dave, new BigDecimal("4500.25"), AccountType.SAVING);
        Account daveCurrent = createAccount(dave, new BigDecimal("980.50"), AccountType.CURRENT);
        Account eveSaving = createAccount(eve, new BigDecimal("31000.00"), AccountType.SAVING);
        Account frankSaving = createAccount(frank, new BigDecimal("6700.00"), AccountType.SAVING);
        Account frankCurrent = createAccount(frank, new BigDecimal("2100.00"), AccountType.CURRENT);
        Account graceSaving = createAccount(grace, new BigDecimal("18500.00"), AccountType.SAVING);

        // Transactions for customer (demo user)
        List<Transaction> txns = new ArrayList<>();
        txns.add(Transaction.builder().amount(new BigDecimal("2000.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(30)).description("Salary deposit").status(TransactionalStatus.SUCCESS).account(customerSaving).sourceAccount(customerSaving.getAccountNumber()).destinationAccount(customerSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("500.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusDays(25)).description("ATM withdrawal").status(TransactionalStatus.SUCCESS).account(customerSaving).sourceAccount(customerSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("1200.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(20)).description("Rent payment").status(TransactionalStatus.SUCCESS).account(customerSaving).sourceAccount(customerSaving.getAccountNumber()).destinationAccount(aliceSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("350.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusDays(15)).description("Grocery shopping").status(TransactionalStatus.SUCCESS).account(customerCurrent).sourceAccount(customerCurrent.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("750.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(10)).description("Utility bills").status(TransactionalStatus.SUCCESS).account(customerSaving).sourceAccount(customerSaving.getAccountNumber()).destinationAccount(bobSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("5000.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(7)).description("Savings transfer").status(TransactionalStatus.SUCCESS).account(customerCurrent).sourceAccount(customerCurrent.getAccountNumber()).destinationAccount(customerSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("100.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(5)).description("Cash deposit").status(TransactionalStatus.SUCCESS).account(customerSaving).sourceAccount(customerSaving.getAccountNumber()).destinationAccount(customerSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("200.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusDays(3)).description("Failed ATM attempt").status(TransactionalStatus.FAILED).account(customerSaving).sourceAccount(customerSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("1500.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(1)).description("Transfer to auditor").status(TransactionalStatus.SUCCESS).account(customerSaving).sourceAccount(customerSaving.getAccountNumber()).destinationAccount(auditorAccount.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("800.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusHours(6)).description("Freelance payment").status(TransactionalStatus.SUCCESS).account(customerSaving).sourceAccount(customerSaving.getAccountNumber()).destinationAccount(customerSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("250.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusHours(2)).description("Coffee shop").status(TransactionalStatus.SUCCESS).account(customerCurrent).sourceAccount(customerCurrent.getAccountNumber()).build());

        // Transactions for alice
        txns.add(Transaction.builder().amount(new BigDecimal("5000.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(28)).description("Monthly salary").status(TransactionalStatus.SUCCESS).account(aliceSaving).sourceAccount(aliceSaving.getAccountNumber()).destinationAccount(aliceSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("300.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(22)).description("Insurance payment").status(TransactionalStatus.SUCCESS).account(aliceSaving).sourceAccount(aliceSaving.getAccountNumber()).destinationAccount(carolSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("150.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusDays(18)).description("Cash withdrawal").status(TransactionalStatus.SUCCESS).account(aliceCurrent).sourceAccount(aliceCurrent.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("2000.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(12)).description("Investment transfer").status(TransactionalStatus.SUCCESS).account(aliceSaving).sourceAccount(aliceSaving.getAccountNumber()).destinationAccount(eveSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("500.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(5)).description("Side project income").status(TransactionalStatus.SUCCESS).account(aliceSaving).sourceAccount(aliceSaving.getAccountNumber()).destinationAccount(aliceSaving.getAccountNumber()).build());

        // Transactions for bob
        txns.add(Transaction.builder().amount(new BigDecimal("3200.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(26)).description("Paycheck").status(TransactionalStatus.SUCCESS).account(bobSaving).sourceAccount(bobSaving.getAccountNumber()).destinationAccount(bobSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("800.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(19)).description("Loan repayment").status(TransactionalStatus.SUCCESS).account(bobSaving).sourceAccount(bobSaving.getAccountNumber()).destinationAccount(graceSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("200.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusDays(8)).description("Weekend spending").status(TransactionalStatus.SUCCESS).account(bobCurrent).sourceAccount(bobCurrent.getAccountNumber()).build());

        // Transactions for carol
        txns.add(Transaction.builder().amount(new BigDecimal("8500.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(20)).description("Bonus deposit").status(TransactionalStatus.SUCCESS).account(carolSaving).sourceAccount(carolSaving.getAccountNumber()).destinationAccount(carolSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("1200.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(14)).description("Family support").status(TransactionalStatus.SUCCESS).account(carolSaving).sourceAccount(carolSaving.getAccountNumber()).destinationAccount(daveSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("400.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusDays(6)).description("Shopping").status(TransactionalStatus.SUCCESS).account(carolSaving).sourceAccount(carolSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("600.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(2)).description("Contribution to shared account").status(TransactionalStatus.PENDING).account(carolSaving).sourceAccount(carolSaving.getAccountNumber()).destinationAccount(frankSaving.getAccountNumber()).build());

        // Transactions for dave
        txns.add(Transaction.builder().amount(new BigDecimal("1800.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(24)).description("Freelance gig").status(TransactionalStatus.SUCCESS).account(daveSaving).sourceAccount(daveSaving.getAccountNumber()).destinationAccount(daveSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("650.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(16)).description("Shared rent").status(TransactionalStatus.SUCCESS).account(daveSaving).sourceAccount(daveSaving.getAccountNumber()).destinationAccount(aliceSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("90.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusDays(4)).description("Transport").status(TransactionalStatus.SUCCESS).account(daveCurrent).sourceAccount(daveCurrent.getAccountNumber()).build());

        // Transactions for eve
        txns.add(Transaction.builder().amount(new BigDecimal("12000.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(15)).description("Contract payment").status(TransactionalStatus.SUCCESS).account(eveSaving).sourceAccount(eveSaving.getAccountNumber()).destinationAccount(eveSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("3000.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(9)).description("Investment").status(TransactionalStatus.SUCCESS).account(eveSaving).sourceAccount(eveSaving.getAccountNumber()).destinationAccount(graceSaving.getAccountNumber()).build());

        // Transactions for frank
        txns.add(Transaction.builder().amount(new BigDecimal("2800.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(22)).description("Monthly pay").status(TransactionalStatus.SUCCESS).account(frankSaving).sourceAccount(frankSaving.getAccountNumber()).destinationAccount(frankSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("450.00")).transactionType(TransactionType.WITHDRAW).transactionDateTime(LocalDateTime.now().minusDays(11)).description("Electronics purchase").status(TransactionalStatus.SUCCESS).account(frankCurrent).sourceAccount(frankCurrent.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("700.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(3)).description("Pending transfer").status(TransactionalStatus.PENDING).account(frankSaving).sourceAccount(frankSaving.getAccountNumber()).destinationAccount(daveSaving.getAccountNumber()).build());

        // Transactions for grace
        txns.add(Transaction.builder().amount(new BigDecimal("6200.00")).transactionType(TransactionType.DEPOSIT).transactionDateTime(LocalDateTime.now().minusDays(18)).description("Quarterly bonus").status(TransactionalStatus.SUCCESS).account(graceSaving).sourceAccount(graceSaving.getAccountNumber()).destinationAccount(graceSaving.getAccountNumber()).build());
        txns.add(Transaction.builder().amount(new BigDecimal("1000.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(7)).description("Loan received").status(TransactionalStatus.SUCCESS).account(graceSaving).sourceAccount(bobSaving.getAccountNumber()).destinationAccount(graceSaving.getAccountNumber()).build());

        // Auditor transactions
        txns.add(Transaction.builder().amount(new BigDecimal("1500.00")).transactionType(TransactionType.TRANSFER).transactionDateTime(LocalDateTime.now().minusDays(1)).description("Transfer from customer").status(TransactionalStatus.SUCCESS).account(auditorAccount).sourceAccount(customerSaving.getAccountNumber()).destinationAccount(auditorAccount.getAccountNumber()).build());

        transactionRepo.saveAll(txns);

        log.info("Demo data seeded successfully");
        log.info("  Admin:    admin@minifin.com / admin123");
        log.info("  Customer: customer@minifin.com / customer123");
        log.info("  Auditor:  auditor@minifin.com / auditor123");
        log.info("  + 7 more customer accounts with transactions");
    }

    private Role createRole(String name) {
        return roleRepo.findByName(name).orElseGet(() -> {
            Role role = new Role();
            role.setName(name);
            return roleRepo.save(role);
        });
    }

    private User createUser(String firstName, String lastName, String email, String password, List<Role> roles) {
        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phoneNumber("+123456" + random.nextInt(9000) + 1000)
                .password(passwordEncoder.encode(password))
                .roles(roles)
                .active(true)
                .build();
        return userRepo.save(user);
    }

    private Account createAccount(User user, BigDecimal balance, AccountType type) {
        String accountNumber;
        do {
            accountNumber = "66" + (random.nextInt(90000000) + 10000000);
        } while (accountRepo.findByAccountNumber(accountNumber).isPresent());

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(type)
                .accountStatus(AccountStatus.ACTIVE)
                .currency(Currency.USD)
                .user(user)
                .balance(balance)
                .build();
        return accountRepo.save(account);
    }
}
