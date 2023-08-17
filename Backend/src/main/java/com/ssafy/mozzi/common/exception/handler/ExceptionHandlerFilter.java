package com.ssafy.mozzi.common.exception.handler;

import javax.ws.rs.core.MediaType;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.mozzi.common.auth.JwtAuthenticationFilter;
import com.ssafy.mozzi.common.exception.ErrorResponse;
import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;

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
            doErrorWrite(request, response, 400, exception.toResponse());
        } catch (NotFoundException exception) {
            doErrorWrite(request, response, 404, exception.toResponse());
        } catch (UnAuthorizedException exception) {
            doErrorWrite(request, response, 401, exception.toResponse());
        } catch (Exception exception) {
            doErrorWrite(request, response, 500, ErrorResponse.builder()
                .code(MozziAPIErrorCode.InternalServerError)
                .message("General Internal Server Error")
                .build());
        }
    }

    private void doErrorWrite(HttpServletRequest request, HttpServletResponse response, int code, ErrorResponse errorResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            response.setStatus(code);
            response.setContentType(MediaType.APPLICATION_JSON);
            response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods","*");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setHeader("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        } catch (Exception e) {
            response.setStatus(500);
        }
    }
}
