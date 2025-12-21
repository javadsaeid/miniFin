package com.miniFin.minFin.security;

import com.miniFin.minFin.exceptions.CustomAuthenticationEntryPoint;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final CustomUserDetailService customUserDetailService;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getTokeFromRequest(request);

        if (token != null) {
            String email;
            // extract email form token
            try {
                email = tokenService.getUsernameFromToken(token);
            } catch (Exception e) {
                log.error(e.getMessage());
                AuthenticationException authenticationException =
                        new BadCredentialsException(e.getMessage());

                customAuthenticationEntryPoint.commence(request, response, authenticationException);
                return;
            }

            // extract userDetails with extracted email.
            UserDetails userDetails = customUserDetailService.loadUserByUsername(email);

            // create authentication toke and set it to security context.
            if (StringUtils.hasText(token) && tokenService.isValidToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    private String getTokeFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return null;
    }
}
