package com.ssafy.life4cut.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssafy.life4cut.common.auth.JwtAuthenticationFilter;
import com.ssafy.life4cut.common.auth.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    // TODO: Need to add path after adding anonymous mapping.
    private static final String[] AUTH_WHITELIST = {
        "/users/**", "/items/**"
        , "/h2-console/**" // TODO: remove before deploy
        // , "/sessions/**"
        // ,"/"
    };

    private static final String[] OPTION_WHITELIST = {
        "/users/**", "/items/**"
        , "/h2-console/**" // TODO: remove before deploy
        , "/sessions/**"
        , "/"
    };

    @Bean
    protected SecurityFilterChain config(HttpSecurity http) throws Exception {
        // TODO: Need to make authorization and authentication policy, when building community component
        return http.csrf(AbstractHttpConfigurer::disable) // TODO: CSRF setting if need
            .cors(AbstractHttpConfigurer::disable) // TODO: Should determine whether CORS needed or not
            .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(HttpMethod.OPTIONS, OPTION_WHITELIST).permitAll()
                    // .dispatcherTypeMatchers(DispatcherType.ERROR)
                    .requestMatchers(AUTH_WHITELIST).permitAll()
                    .anyRequest().authenticated()
                // .anonymous()
            )
            .headers(headers ->
                headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
            .getOrBuild();
    }
}
