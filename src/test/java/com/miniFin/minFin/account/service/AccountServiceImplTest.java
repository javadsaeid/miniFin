package com.miniFin.minFin.account.service;

import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.account.repo.AccountRepo;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.auth_users.repo.UserRepo;
import com.miniFin.minFin.auth_users.service.UserService;
import com.miniFin.minFin.enums.AccountStatus;
import com.miniFin.minFin.enums.AccountType;
import com.miniFin.minFin.enums.Currency;
import com.miniFin.minFin.exceptions.BadRequestException;
import com.miniFin.minFin.exceptions.NotFoundException;
import com.miniFin.minFin.res.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepo accountRepo;
    @Mock
    private UserService userService;
    @Mock
    private ModelMapper modelMapper;
    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private AccountServiceImpl accountService;

    private User user;
    private Account account;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .accounts(new java.util.ArrayList<>())
                .build();

        account = Account.builder()
                .id(1L)
                .accountNumber("6612345678")
                .accountType(AccountType.SAVING)
                .accountStatus(AccountStatus.ACTIVE)
                .balance(BigDecimal.ZERO)
                .currency(Currency.USD)
                .user(user)
                .build();

        user.getAccounts().add(account);
    }

    @Test
    void createAccount_generatesAccountNumberAndSaves() {
        when(accountRepo.findByAccountNumber(anyString())).thenReturn(Optional.empty());
        when(accountRepo.save(any(Account.class))).thenReturn(account);

        Account savedAccount = accountService.createAccount(AccountType.SAVING, user);

        assertNotNull(savedAccount);
        verify(accountRepo).save(any(Account.class));
    }

    @Test
    void getMyAccounts_returnsListOfAccountDTO() {
        AccountDTO accountDTO = new AccountDTO();
        accountDTO.setId(1L);
        accountDTO.setAccountNumber("6612345678");

        when(userService.getCurrentLoggedInUser()).thenReturn(user);
        when(accountRepo.findByUserId(1L)).thenReturn(List.of(account));
        when(modelMapper.map(account, AccountDTO.class)).thenReturn(accountDTO);

        Response<List<AccountDTO>> response = accountService.getMyAccounts();

        assertEquals(200, response.getStatusCode());
        assertEquals("list of accounts retrieved", response.getMessage());
        assertEquals(1, response.getData().size());
        assertEquals("6612345678", response.getData().get(0).getAccountNumber());
    }

    @Test
    void closeAccount_success_zeroBalance() {
        when(userService.getCurrentLoggedInUser()).thenReturn(user);
        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(account));
        when(accountRepo.save(any(Account.class))).thenReturn(account);

        Response<?> response = accountService.closeAccount("6612345678");

        assertEquals(200, response.getStatusCode());
        assertEquals("account closed", response.getMessage());
        assertEquals(AccountStatus.CLOSED, account.getAccountStatus());
        assertNotNull(account.getClosedAt());
    }

    @Test
    void closeAccount_nonZeroBalance_throwsBadRequestException() {
        Account nonZeroAccount = Account.builder()
                .id(1L)
                .accountNumber("6612345678")
                .accountType(AccountType.SAVING)
                .accountStatus(AccountStatus.ACTIVE)
                .balance(new BigDecimal("100.00"))
                .currency(Currency.USD)
                .user(user)
                .build();

        user.getAccounts().clear();
        user.getAccounts().add(nonZeroAccount);

        when(userService.getCurrentLoggedInUser()).thenReturn(user);
        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(nonZeroAccount));

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> accountService.closeAccount("6612345678"));

        assertEquals("account balance must be zero before closing", exception.getMessage());
        assertEquals(AccountStatus.ACTIVE, nonZeroAccount.getAccountStatus());
    }

    @Test
    void closeAccount_wrongUser_throwsNotFoundException() {
        User otherUser = User.builder()
                .id(2L)
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@example.com")
                .accounts(new java.util.ArrayList<>())
                .build();

        when(userService.getCurrentLoggedInUser()).thenReturn(otherUser);
        when(accountRepo.findByAccountNumber("6612345678")).thenReturn(Optional.of(account));

        assertThrows(NotFoundException.class,
                () -> accountService.closeAccount("6612345678"));
    }
}
