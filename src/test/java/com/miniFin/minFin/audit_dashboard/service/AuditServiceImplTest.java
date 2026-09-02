package com.miniFin.minFin.audit_dashboard.service;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.account.repo.AccountRepo;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.auth_users.repo.UserRepo;
import com.miniFin.minFin.transaction.dtos.TransactionDTO;
import com.miniFin.minFin.transaction.entity.Transaction;
import com.miniFin.minFin.transaction.repo.TransactionRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditServiceImplTest {

    @Mock
    private UserRepo userRepo;
    @Mock
    private TransactionRepo transactionRepo;
    @Mock
    private AccountRepo accountRepo;
    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private AuditServiceImpl auditService;

    private User user;
    private UserDTO userDTO;
    private Account account;
    private AccountDTO accountDTO;
    private Transaction transaction;
    private TransactionDTO transactionDTO;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .build();

        userDTO = UserDTO.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .build();

        account = Account.builder()
                .id(1L)
                .accountNumber("6612345678")
                .balance(BigDecimal.ZERO)
                .user(user)
                .build();

        accountDTO = new AccountDTO();
        accountDTO.setId(1L);
        accountDTO.setAccountNumber("6612345678");

        transaction = Transaction.builder()
                .id(1L)
                .amount(new BigDecimal("100.00"))
                .account(account)
                .build();

        transactionDTO = new TransactionDTO();
        transactionDTO.setId(1L);
        transactionDTO.setAmount(new BigDecimal("100.00"));
    }

    @Test
    void getSystemTotals_returnsCorrectCounts() {
        when(userRepo.count()).thenReturn(5L);
        when(accountRepo.count()).thenReturn(10L);
        when(transactionRepo.count()).thenReturn(25L);

        Map<String, Long> totals = auditService.getSystemTotals();

        assertEquals(5L, totals.get("totalUsers"));
        assertEquals(10L, totals.get("totalAccounts"));
        assertEquals(25L, totals.get("totalTransactions"));
    }

    @Test
    void findUserByEmail_returnsOptionalOfUserDTO() {
        when(userRepo.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);

        Optional<UserDTO> result = auditService.findUserByEmail("john@example.com");

        assertTrue(result.isPresent());
        assertEquals("john@example.com", result.get().getEmail());
    }

    @Test
    void findUserByEmail_notFound_returnsEmptyOptional() {
        when(userRepo.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        Optional<UserDTO> result = auditService.findUserByEmail("unknown@example.com");

        assertFalse(result.isPresent());
    }

    @Test
    void getAllUsers_returnsList() {
        Page<User> userPage = new PageImpl<>(List.of(user), PageRequest.of(0, 10, Sort.by("id").descending()), 1);

        when(userRepo.findAll(any(PageRequest.class))).thenReturn(userPage);
        when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);

        List<UserDTO> result = auditService.getAllUsers(0, 10);

        assertEquals(1, result.size());
        assertEquals("john@example.com", result.get(0).getEmail());
    }
}
