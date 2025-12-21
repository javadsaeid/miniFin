package com.miniFin.minFin.security;

import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.auth_users.repo.UserRepo;
import com.miniFin.minFin.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(username).orElseThrow(() -> new NotFoundException(username));

        return AuthUser.builder()
                .user(user)
                .build();
    }
}
