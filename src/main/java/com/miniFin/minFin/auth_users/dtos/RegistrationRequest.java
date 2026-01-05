package com.miniFin.minFin.auth_users.dtos;

import com.miniFin.minFin.role.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class RegistrationRequest {
    @NotBlank(message = "FirstName is required")
    private String firstName;
    private String lastName;
    private String phoneNumber;
    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
    private List<String> roles;
}
