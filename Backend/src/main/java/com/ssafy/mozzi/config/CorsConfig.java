package com.ssafy.mozzi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("https://mozzi.lol/", "http://localhost:8080/", "http://localhost:5173/",
                "http://localhost:5174/")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "OPTIONS")
            .allowedHeaders("*")
            .maxAge(3000)
            .allowCredentials(true);
    }
}
