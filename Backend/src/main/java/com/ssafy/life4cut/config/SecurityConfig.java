package com.ssafy.life4cut.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // TODO: Need to add path after adding anonymous mapping.
    private static final String[] AUTH_WHITELIST = {
        "/", "/users/**", "/sessions/**", "/items/**"
    };

    @Bean
    protected SecurityFilterChain config(HttpSecurity http) throws Exception {
        // TODO: Need to make authorization and authentication policy, when building community component
        return http.csrf(AbstractHttpConfigurer::disable) // TODO: CSRF setting if need
            .cors(AbstractHttpConfigurer::disable) // TODO: Should determine whether CORS needed or not
            .authorizeHttpRequests(authorize -> authorize
                // .dispatcherTypeMatchers(DispatcherType.ERROR)
                .requestMatchers(AUTH_WHITELIST)
                .permitAll()
                .anyRequest()
                .anonymous()
            )
            .getOrBuild();
    }
}
