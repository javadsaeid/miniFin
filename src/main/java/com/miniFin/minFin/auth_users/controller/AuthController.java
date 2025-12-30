package com.miniFin.minFin.auth_users.controller;

import com.miniFin.minFin.auth_users.dtos.LoginRequest;
import com.miniFin.minFin.auth_users.dtos.LoginResponse;
import com.miniFin.minFin.auth_users.dtos.RegistrationRequest;
import com.miniFin.minFin.auth_users.dtos.ResetPasswordRequest;
import com.miniFin.minFin.auth_users.service.AuthService;
import com.miniFin.minFin.res.Response;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Response<String>> register(@RequestBody @Valid RegistrationRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<Response<LoginResponse>> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Response<?>> forgotPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.forgetPassword(request.getEmail()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Response<?>> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.updatePasswordViaResetCode(request));
    }
}
