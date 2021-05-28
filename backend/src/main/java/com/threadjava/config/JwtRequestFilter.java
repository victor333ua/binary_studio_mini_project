package com.threadjava.config;

import com.threadjava.auth.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

import static com.threadjava.config.SecurityConstants.HEADER_STRING;
import static com.threadjava.config.SecurityConstants.TOKEN_PREFIX;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String header = request.getHeader(HEADER_STRING);

        if (header == null || !header.startsWith(TOKEN_PREFIX)){// || request.getRequestURI().matches()) {
            chain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authentication;
        try {
            authentication = getAuthentication(header);
        } catch (Exception e) {
            throw new ServletException(e);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(String header) throws Exception {
        var tokenString = header.replace(TOKEN_PREFIX, "");
        // parse the token.
        if (tokenService.isTokenExpired(tokenString))  throw new Exception("token expired");
        String userId = tokenService.extractUserId(tokenString);
        if (userId == null) throw new Exception("userId from token == null");

        return new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());
    }
}
