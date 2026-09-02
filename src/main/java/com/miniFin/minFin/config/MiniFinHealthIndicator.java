package com.miniFin.minFin.config;

import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.stereotype.Component;

import com.miniFin.minFin.auth_users.repo.UserRepo;
import lombok.RequiredArgsConstructor;

@Component("minifinApp")
@RequiredArgsConstructor
public class MiniFinHealthIndicator implements HealthIndicator {
    private final UserRepo userRepo;

    @Override
    public Health health() {
        try {
            long count = userRepo.count();
            return Health.up()
                    .withDetail("users", count)
                    .withDetail("status", "operational")
                    .build();
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}
