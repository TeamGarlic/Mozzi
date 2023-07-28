package com.ssafy.mozzi.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.RequiredArgsConstructor;

@OpenAPIDefinition(
    info = @Info(title = "인생클립",
        description = "인생클립 api 명세",
        version = "v0.0.1"))
@RequiredArgsConstructor
@Configuration
public class SwaggerConfig {

    // @Bean
    // public GroupedOpenApi chatOpenApi() {
    //     String[] paths = {"/v0/**"};
    //
    //     return GroupedOpenApi.builder()
    //         .group("인생클립 API v0")
    //         .pathsToMatch(paths)
    //         .build();
    // }
}