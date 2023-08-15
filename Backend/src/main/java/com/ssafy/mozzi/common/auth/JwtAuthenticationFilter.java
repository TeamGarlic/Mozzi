package com.ssafy.mozzi.common.auth;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;
import com.ssafy.mozzi.common.exception.handler.NotFoundException;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.GenericFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilter {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * API를 호출하기 전 적용하는 Filter
     * @see com.ssafy.mozzi.config.SecurityConfig
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws
        IOException, ServletException {
        String token = jwtTokenProvider.resolveToken((HttpServletRequest)request);

        if (token == null) {
            chain.doFilter(request, response);
            return;
        }

        if (!jwtTokenProvider.validateTokenExceptExpiration(token)) {
            throw new UnAuthorizedException(MozziAPIErrorCode.InvalidAccessToken, "Invalid Access Token");
        }

        try {
            Authentication auth = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            chain.doFilter(request, response);
        } catch (UsernameNotFoundException exception) {
            throw new NotFoundException(MozziAPIErrorCode.UserIdNotExists, "User not exists");
        }
    }
}
