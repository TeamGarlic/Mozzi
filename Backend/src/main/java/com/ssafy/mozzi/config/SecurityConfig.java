package com.ssafy.mozzi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssafy.mozzi.common.auth.JwtAuthenticationFilter;
import com.ssafy.mozzi.common.auth.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    // TODO: Need to add path after adding anonymous mapping.

    @Bean
    protected SecurityFilterChain config(HttpSecurity http) throws Exception {
        // TODO: Need to make authorization and authentication policy, when building community component
        return http.csrf(AbstractHttpConfigurer::disable) // TODO: CSRF setting if need
            .cors(AbstractHttpConfigurer::disable) // TODO: Should determine whether CORS needed or not
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS).permitAll()  // preflight 로 보내는 요청을 해결
                .requestMatchers("/h2-console/**").permitAll()  // h2 요청 해결
                .requestMatchers("/sessions/testpath/**").permitAll()

                // users 요청에 대한 보안 설정
                .requestMatchers(HttpMethod.POST, "/users/register").permitAll()
                .requestMatchers(HttpMethod.GET, "/users/check-login-id").permitAll()
                .requestMatchers(HttpMethod.POST, "/users/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/users/reissue").permitAll()
                .requestMatchers(HttpMethod.GET, "/users").authenticated()
                .requestMatchers(HttpMethod.GET, "/users/logout").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/users").permitAll()
                .requestMatchers(HttpMethod.POST, "/users/reset").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/users").authenticated()

                // sessions 요청에 대한 보안 설정
                .requestMatchers(HttpMethod.POST, "/sessions").authenticated()
                .requestMatchers(HttpMethod.GET, "/sessions/{shareCode}").permitAll()
                .requestMatchers(HttpMethod.POST, "/sessions/connections").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/sessions/{sessionId}").permitAll()
                .requestMatchers(HttpMethod.POST, "/sessions/file").authenticated()
                .requestMatchers(HttpMethod.GET, "/sessions/file").permitAll()

                // items 요청에 대한 보안 설정
                .requestMatchers(HttpMethod.GET, "/items/backgrounds").permitAll()
                .requestMatchers(HttpMethod.POST, "/items/background").authenticated()
                .requestMatchers(HttpMethod.POST, "/items/background/favorite").authenticated()
                .requestMatchers(HttpMethod.POST, "/items/frame").authenticated()
                .requestMatchers(HttpMethod.POST, "/items/frame/{frameId}").permitAll()
                .requestMatchers(HttpMethod.GET, "/items/stickers").permitAll()
                .requestMatchers(HttpMethod.GET, "/items/frames").permitAll()

                // files 에 대한 보안 설정
                .requestMatchers(HttpMethod.POST, "/files/mozziroll/upload").authenticated()
                .requestMatchers(HttpMethod.GET, "/files/mozziroll/{mozzirollId}").permitAll()
                .requestMatchers(HttpMethod.GET, "/files/object/{objectName}").permitAll()

                // swagger 에 대한 보안 설정
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/mozzi-api/**").permitAll()
                .requestMatchers("/v3/**").permitAll()

                // mozzirolls 에 대한 보안 설정
                .requestMatchers(HttpMethod.GET, "/mozzirolls").authenticated()
                .requestMatchers(HttpMethod.POST, "/mozzirolls/link").authenticated()
                .requestMatchers(HttpMethod.POST, "/mozzirolls/like/{userMozzirollId}").authenticated()
                .requestMatchers(HttpMethod.GET, "/mozzirolls/popular").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/mozzirolls/{userMozzirollId}").authenticated()
            )
            .headers(headers ->
                headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
            .getOrBuild();
    }
}
