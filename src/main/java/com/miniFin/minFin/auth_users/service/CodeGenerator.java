package com.miniFin.minFin.auth_users.service;

import com.miniFin.minFin.auth_users.repo.PasswordResetRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
public class CodeGenerator {
    private final PasswordResetRepo passwordResetCodeRepo;

    private static final String ALPHA_NUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789";
    private static final int CODE_LENGTH = 5;

    public String generateUniqueCode() {
        String code;

        do {
            code = generateRandomCode();
        } while (passwordResetCodeRepo.findByCode(code).isPresent());

        return code;
    }

    private String generateRandomCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        SecureRandom random = new SecureRandom();

        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(ALPHA_NUMERIC.charAt(random.nextInt(ALPHA_NUMERIC.length())));
        }

        return sb.toString();
    }
}
