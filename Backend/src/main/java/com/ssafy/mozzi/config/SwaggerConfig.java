package com.ssafy.mozzi.config;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
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

        Schema<Map<String, Object>> InternalSchema = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.InternalServerError))
            .addProperty("message", new StringSchema().example("General Internal Server Error"));

        Schema<Map<String, Object>> UserIdNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UserIdNotExists))
            .addProperty("message", new StringSchema().example("User Id Not exists"));

        Schema<Map<String, Object>> InvalidRefreshToken = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.InvalidRefreshToken))
            .addProperty("message", new StringSchema().example("Refresh Token is not valid"));

        Schema<Map<String, Object>> UserRegisterFail = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UserRegisterFail))
            .addProperty("message", new StringSchema().example("User Register Fail"));

        Schema<Map<String, Object>> UserLoginFail = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UserLoginFail))
            .addProperty("message", new StringSchema().example("User Login Fail"));

        Schema<Map<String, Object>> DuplicateShareCode = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.DuplicateShareCode))
            .addProperty("message", new StringSchema().example("Duplicate Share Code"));

        Schema<Map<String, Object>> ShareCodeNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.ShareCodeNotExists))
            .addProperty("message", new StringSchema().example("Share Code not exists"));

        Schema<Map<String, Object>> AccessTokenNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.AccessTokenNotExists))
            .addProperty("message", new StringSchema().example("Access Token not exists"));

        Schema<Map<String, Object>> AlreadyLinkedMozzi = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.AlreadyLinkedMozzi))
            .addProperty("message", new StringSchema().example("Requested Mozzi is already linked"));

        Schema<Map<String, Object>> MozzirollNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.MozzirollNotExists))
            .addProperty("message", new StringSchema().example("Requested Mozziroll not exists"));

        Schema<Map<String, Object>> BoothNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.BoothNotExists))
            .addProperty("message", new StringSchema().example("Requested Booth not exists"));

        Schema<Map<String, Object>> UnAuthorized = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UnAuthorized))
            .addProperty("message", new StringSchema().example("You are not authorized"));

        Schema<Map<String, Object>> NoData = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.NoData))
            .addProperty("message", new StringSchema().example("You requested without any data"));

        Schema<Map<String, Object>> UserEmailNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UserEmailNotExists))
            .addProperty("message", new StringSchema().example("User don't have email information"));

        Schema<Map<String, Object>> FileAlreadyExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.FileAlreadyExists))
            .addProperty("message", new StringSchema().example("Requested File already exists"));

        Schema<Map<String, Object>> FileNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.FileNotExists))
            .addProperty("message", new StringSchema().example("Requested File does not exist"));

        Components components = new Components()
            .addSecuritySchemes("Authorization", getJwtSecurityScheme())
            .addSchemas("InternalError", InternalSchema)
            .addSchemas("UserIdNotExists", UserIdNotExists)
            .addSchemas("InvalidRefreshToken", InvalidRefreshToken)
            .addSchemas("UserRegisterFail", UserRegisterFail)
            .addSchemas("UserLoginFail", UserLoginFail)
            .addSchemas("DuplicateShareCode", DuplicateShareCode)
            .addSchemas("ShareCodeNotExists", ShareCodeNotExists)
            .addSchemas("AccessTokenNotExists", AccessTokenNotExists)
            .addSchemas("AlreadyLinkedMozzi", AlreadyLinkedMozzi)
            .addSchemas("MozzirollNotExists", MozzirollNotExists)
            .addSchemas("BoothNotExists", BoothNotExists)
            .addSchemas("UnAuthorized", UnAuthorized)
            .addSchemas("NoData", NoData)
            .addSchemas("UserEmailNotExists", UserEmailNotExists)
            .addSchemas("FileAlreadyExists", FileAlreadyExists)
            .addSchemas("FileNotExists", FileNotExists);

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