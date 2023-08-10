package com.ssafy.mozzi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openApi(@Value("$springdoc.version") String springdocVersion) {
        io.swagger.v3.oas.models.info.Info info = new io.swagger.v3.oas.models.info.Info()
            .title("Mozzi")
            .version(springdocVersion)
            .description("Mozzi API");

        // String authorization = "Authorization";
        // SecurityScheme securityScheme = new SecurityScheme()
        //     .name(authorization)
        //     .type(SecurityScheme.Type.HTTP)
        //     .in(SecurityScheme.In.HEADER)
        //     .bearerFormat("JWT")
        //     .scheme("bearer");

        Components components = new Components()
            .addSecuritySchemes("Authorization", getJwtSecurityScheme());

        SecurityRequirement securityRequirement = new SecurityRequirement()
            .addList("Authorization");

        return new OpenAPI()
            .info(info)
            .components(components)
            .addSecurityItem(securityRequirement);
    }

    private SecurityScheme getJwtSecurityScheme() {
        return new SecurityScheme()
            .type(SecurityScheme.Type.APIKEY)
            .in(SecurityScheme.In.HEADER)
            .name("Authorization");
    }
}