package com.devtiro.ticket_platform.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Configuration
public class DevJwtConfig {

    @Bean
    @ConditionalOnMissingBean
    public JwtDecoder devJwtDecoder() {
        return new JwtDecoder() {
            @Override
            public Jwt decode(String token) throws JwtException {
                Instant now = Instant.now();
                Map<String, Object> headers = Map.of("alg", "none");
                // Use a stable UUID subject and include username/email claims so
                // downstream code that expects a UUID and user info works in dev.
                String devUuid = "11111111-1111-1111-1111-111111111111";
                Map<String, Object> claims = Map.of(
                        "sub", devUuid,
                        "scope", "openid",
                        "preferred_username", "devuser",
                        "email", "devuser@example.com"
                );
                return new Jwt(token, now, now.plus(365, ChronoUnit.DAYS), headers, claims);
            }
        };
    }

}
