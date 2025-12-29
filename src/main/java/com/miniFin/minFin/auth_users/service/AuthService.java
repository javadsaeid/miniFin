package com.miniFin.minFin.auth_users.service;


import com.miniFin.minFin.auth_users.dtos.LoginRequest;
import com.miniFin.minFin.auth_users.dtos.LoginResponse;
import com.miniFin.minFin.auth_users.dtos.RegistrationRequest;
import com.miniFin.minFin.auth_users.dtos.ResetPasswordRequest;
import com.miniFin.minFin.res.Response;

public interface AuthService {
    Response<String> register(RegistrationRequest registrationRequest);
    Response<LoginResponse> login(LoginRequest loginRequest);
    Response<?> forgetPassword(String email);
    Response<?> updatePasswordViaResetCode(ResetPasswordRequest resetPasswordRequest);
}
