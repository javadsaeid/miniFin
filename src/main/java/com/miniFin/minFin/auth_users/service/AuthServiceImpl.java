package com.miniFin.minFin.auth_users.service;

import com.miniFin.minFin.auth_users.dtos.LoginRequest;
import com.miniFin.minFin.auth_users.dtos.LoginResponse;
import com.miniFin.minFin.auth_users.dtos.RegistrationRequest;
import com.miniFin.minFin.auth_users.dtos.ResetPasswordRequest;
import com.miniFin.minFin.auth_users.repo.UserRepo;
import com.miniFin.minFin.notification.service.NotificationService;
import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.role.repo.RoleRepo;
import com.miniFin.minFin.security.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final NotificationService notificationService;

    @Override
    public Response<String> register(RegistrationRequest registrationRequest) {
        return null;
    }

    @Override
    public Response<LoginResponse> login(LoginRequest loginRequest) {
        return null;
    }

    @Override
    public Response<?> forgetPassword(String email) {
        return null;
    }

    @Override
    public Response<?> updatePassword(ResetPasswordRequest resetPasswordRequest) {
        return null;
    }
}
