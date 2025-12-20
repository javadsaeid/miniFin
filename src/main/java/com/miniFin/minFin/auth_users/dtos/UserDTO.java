package com.miniFin.minFin.auth_users.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.miniFin.minFin.account.dtos.AccountDTO;
import com.miniFin.minFin.notification.dtos.NotificationDTO;
import com.miniFin.minFin.notification.entity.Notification;
import com.miniFin.minFin.role.entity.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;

    @JsonIgnore
    private String password;
    private List<Role> roles;

    private String profilePictureUrl;
    private boolean active;
    @JsonManagedReference
    private List<AccountDTO> accounts;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
