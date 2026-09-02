package com.miniFin.minFin.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @InjectMocks
    private TokenService tokenService;

    private final String testSecret = "mySecretKeyForTestingPurposes1234567890";
    private final long testExpirationTime = 3600000L; // 1 hour
    private final String testEmail = "john@example.com";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(tokenService, "JWT_SECRET", testSecret);
        ReflectionTestUtils.setField(tokenService, "EXPIRATION_TIME", testExpirationTime);
        SecretKey key = new SecretKeySpec(testSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        ReflectionTestUtils.setField(tokenService, "key", key);
    }

    @Test
    void generateToken_returnsNonNullToken() {
        String token = tokenService.generateToken(testEmail);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void getUsernameFromToken_returnsCorrectEmail() {
        String token = tokenService.generateToken(testEmail);

        String extractedEmail = tokenService.getUsernameFromToken(token);

        assertEquals(testEmail, extractedEmail);
    }

    @Test
    void isValidToken_returnsTrueForValidToken() {
        String token = tokenService.generateToken(testEmail);
        UserDetails userDetails = User.builder()
                .username(testEmail)
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        boolean isValid = tokenService.isValidToken(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    void isValidToken_returnsFalseForExpiredToken() {
        // Use 0 expiration so the token is immediately expired
        ReflectionTestUtils.setField(tokenService, "EXPIRATION_TIME", 0L);

        String token = tokenService.generateToken(testEmail);

        // Wait a moment to ensure expiration
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        UserDetails userDetails = User.builder()
                .username(testEmail)
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        // jjwt throws ExpiredJwtException when parsing an expired token
        assertThrows(ExpiredJwtException.class,
                () -> tokenService.isValidToken(token, userDetails));
    }
}
