package com.ssafy.mozzi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${spring.mozzi.cors}")
    private String[] corsPaths;

    private static final String[] mappings = {
        "/mozzirolls/**", "/sessions/**", "/files/**", "/items/**",
        "/users", "/users/reset", "/users/reissue", "/users/register", "/users/logout", "/users/check-login-id"
    };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        for (String mapping : mappings) {
            registry.addMapping(mapping)
                .allowedOrigins(corsPaths)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3000)
                .allowCredentials(true);
        }
    }
}
