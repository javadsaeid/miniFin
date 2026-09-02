package com.miniFin.minFin.auth_users.service;

import com.miniFin.minFin.account.entity.Account;
import com.miniFin.minFin.account.service.AccountService;
import com.miniFin.minFin.auth_users.dtos.LoginRequest;
import com.miniFin.minFin.auth_users.dtos.LoginResponse;
import com.miniFin.minFin.auth_users.dtos.RegistrationRequest;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.auth_users.repo.PasswordResetRepo;
import com.miniFin.minFin.auth_users.repo.UserRepo;
import com.miniFin.minFin.enums.AccountStatus;
import com.miniFin.minFin.enums.AccountType;
import com.miniFin.minFin.enums.Currency;
import com.miniFin.minFin.exceptions.BadRequestException;
import com.miniFin.minFin.exceptions.NotFoundException;
import com.miniFin.minFin.notification.service.NotificationService;
import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.role.entity.Role;
import com.miniFin.minFin.role.repo.RoleRepo;
import com.miniFin.minFin.security.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepo userRepo;
    @Mock
    private RoleRepo roleRepo;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private TokenService tokenService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AccountService accountService;
    @Mock
    private CodeGenerator codeGenerator;
    @Mock
    private PasswordResetRepo passwordResetRepo;

    @InjectMocks
    private AuthServiceImpl authService;

    private Role customerRole;
    private User user;
    private Account account;
    private RegistrationRequest registrationRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        customerRole = new Role();
        customerRole.setId(1L);
        customerRole.setName("CUSTOMER");

        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("encodedPassword")
                .roles(List.of(customerRole))
                .active(true)
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

        registrationRequest = new RegistrationRequest();
        registrationRequest.setFirstName("John");
        registrationRequest.setLastName("Doe");
        registrationRequest.setEmail("john@example.com");
        registrationRequest.setPassword("password123");
        registrationRequest.setRoles(null);

        loginRequest = new LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void register_success() {
        when(roleRepo.findByName("CUSTOMER")).thenReturn(Optional.of(customerRole));
        when(userRepo.findByEmail("john@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(accountService.createAccount(any(AccountType.class), any(User.class))).thenReturn(account);

        Response<String> response = authService.register(registrationRequest);

        assertEquals(200, response.getStatusCode());
        assertEquals("Your account has been created", response.getMessage());
        assertNotNull(response.getData());
        verify(userRepo).save(any(User.class));
        verify(notificationService, times(2)).sendEmail(any(), any());
    }

    @Test
    void register_duplicateEmail_throwsBadRequestException() {
        when(roleRepo.findByName("CUSTOMER")).thenReturn(Optional.of(customerRole));
        when(userRepo.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> authService.register(registrationRequest));

        assertEquals("Email address already in use", exception.getMessage());
        verify(userRepo, never()).save(any());
    }

    @Test
    void login_success_returnsToken() {
        when(userRepo.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(tokenService.generateToken("john@example.com")).thenReturn("test-jwt-token");

        Response<LoginResponse> response = authService.login(loginRequest);

        assertEquals(200, response.getStatusCode());
        assertEquals("Successfully logged in", response.getMessage());
        assertNotNull(response.getData());
        assertEquals("test-jwt-token", response.getData().getToken());
        assertTrue(response.getData().getRoles().contains("CUSTOMER"));
    }

    @Test
    void login_wrongPassword_throwsBadRequestException() {
        when(userRepo.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(false);

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> authService.login(loginRequest));

        assertEquals("Wrong password", exception.getMessage());
        verify(tokenService, never()).generateToken(anyString());
    }

    @Test
    void login_userNotFound_throwsNotFoundException() {
        when(userRepo.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        LoginRequest unknownRequest = new LoginRequest();
        unknownRequest.setEmail("unknown@example.com");
        unknownRequest.setPassword("password123");

        assertThrows(NotFoundException.class,
                () -> authService.login(unknownRequest));
    }
}
