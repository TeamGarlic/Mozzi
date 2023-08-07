package com.ssafy.mozzi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(servers = {@Server(url = "https://api.mozzi.lol/", description = "Moozi API Server")})
@SpringBootApplication
public class MozziApplication {

    public static void main(String[] args) {
        SpringApplication.run(MozziApplication.class, args);
    }

}
