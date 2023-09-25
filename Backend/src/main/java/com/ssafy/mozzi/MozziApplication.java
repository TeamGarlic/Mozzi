package com.ssafy.mozzi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(servers = {@Server(url = "https://api.mozzi.lol/", description = "Mozzi API Server"),
    @Server(url = "http://localhost:8080/", description = "Local Test")})
@SpringBootApplication
public class MozziApplication {

    public static void main(String[] args) {
        SpringApplication.run(MozziApplication.class, args);
    }
}
