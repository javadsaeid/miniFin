package com.miniFin.minFin.auth_users.controller;

import com.miniFin.minFin.auth_users.dtos.LoginRequest;
import com.miniFin.minFin.auth_users.dtos.LoginResponse;
import com.miniFin.minFin.auth_users.dtos.RegistrationRequest;
import com.miniFin.minFin.auth_users.dtos.ResetPasswordRequest;
import com.miniFin.minFin.auth_users.service.AuthService;
import com.miniFin.minFin.res.Response;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Authentication", description = "User registration, login, and password reset endpoints")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account with the provided registration details")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid registration data")
    })
    public ResponseEntity<Response<String>> register(@RequestBody @Valid RegistrationRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful, JWT token returned"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<Response<LoginResponse>> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset", description = "Sends a password reset email to the specified address")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Password reset email sent"),
        @ApiResponse(responseCode = "404", description = "Email not found")
    })
    public ResponseEntity<Response<?>> forgotPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.forgetPassword(request.getEmail()));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Resets the user password using the provided reset code and new password")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Password reset successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid or expired reset code")
    })
    public ResponseEntity<Response<?>> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.updatePasswordViaResetCode(request));
    }
}
