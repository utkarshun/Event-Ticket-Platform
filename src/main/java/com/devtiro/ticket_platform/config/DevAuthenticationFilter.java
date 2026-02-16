package com.devtiro.ticket_platform.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Collections;

@Component
@ConditionalOnProperty(prefix = "app.dev", name = "disable-security", havingValue = "true")
public class DevAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // create a development Jwt and set it as the authentication principal
        Instant now = Instant.now();
        Map<String, Object> headers = Map.of("alg", "none");
        String devUuid = "11111111-1111-1111-1111-111111111111";
        Map<String, Object> claims = Map.of(
                "sub", devUuid,
                "preferred_username", "devuser",
                "email", "devuser@example.com",
                "scope", "openid"
        );

        Jwt jwt = new Jwt("dev-token", now, now.plus(365, ChronoUnit.DAYS), headers, claims);
        JwtAuthenticationToken auth = new JwtAuthenticationToken(jwt, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}
