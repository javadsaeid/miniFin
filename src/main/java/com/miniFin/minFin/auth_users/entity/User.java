package com.miniFin.minFin.auth_users.entity;

import com.miniFin.minFin.account.entity.Account;
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

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String firstName;
    @Column
    private String lastName;

    @Column
    private String phoneNumber;

    @Email
    @Column(unique = true)
    @NotBlank(message = "Email is required")
    private String email;

    @Column
    private String password;

    @Column(unique = true)
    private String profilePictureUrl;

    @Column
    private boolean active = true;

    @Column
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles;

    @OneToMany(mappedBy = "user",  cascade = CascadeType.ALL)
    private List<Account> accounts;

    @OneToMany(mappedBy = "user",  cascade = CascadeType.ALL)
    private List<Notification> notifications;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt;
}
