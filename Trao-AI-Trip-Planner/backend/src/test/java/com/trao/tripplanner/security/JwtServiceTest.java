package com.trao.tripplanner.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {
    @Test
    void createsAndValidatesToken() {
        JwtService jwtService = new JwtService("test-secret-that-is-long-enough-for-hmac", 60);

        String token = jwtService.createToken("user-123", "traveler@example.com");

        assertThat(jwtService.isValid(token)).isTrue();
        assertThat(jwtService.extractEmail(token)).isEqualTo("traveler@example.com");
    }

    @Test
    void rejectsShortSecret() {
        assertThatThrownBy(() -> new JwtService("short", 60))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("JWT secret");
    }
}
