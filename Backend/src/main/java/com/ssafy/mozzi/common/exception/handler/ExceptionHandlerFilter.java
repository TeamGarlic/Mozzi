package com.ssafy.mozzi.common.exception.handler;

import javax.ws.rs.core.MediaType;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.mozzi.common.auth.JwtAuthenticationFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExceptionHandlerFilter extends OncePerRequestFilter {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
        FilterChain filterChain) {
        try {
            // jwtAuthenticationFilter.doFilter(request, response, filterChain);
            filterChain.doFilter(request, response);
        } catch (BadRequestException exception) {
            doErrorWrite(response, 400, exception);
        } catch (NotFoundException exception) {
            doErrorWrite(response, 404, exception);
        } catch (UnAuthorizedException exception) {
            doErrorWrite(response, 401, exception);
        } catch (Exception exception) {
            doErrorWrite(response, 500, exception);
        }
    }

    private void doErrorWrite(HttpServletResponse response, int code, Exception exception) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            response.setStatus(code);
            response.setContentType(MediaType.APPLICATION_JSON);
            response.getWriter().write(objectMapper.writeValueAsString(exception));
        } catch (Exception e) {
            response.setStatus(500);
        }
    }
}
