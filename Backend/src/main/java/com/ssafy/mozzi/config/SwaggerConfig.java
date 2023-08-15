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

    public static final String RES_InternalServerError = "{\n\t\"code\":0,\n\t\"message\":\"General Internal Server Error\"\n}";

    public static final String RES_UserIdNotExists = "{\n\t\"code\":1,\n\t\"message\":\"User Id Not exists\"\n}";

    public static final String RES_InvalidRefreshToken = "{\n\t\"code\":2,\n\t\"message\":\"Refresh Token is not valid\"\n}";

    public static final String RES_UserRegisterFail = "{\n\t\"code\":3,\n\t\"message\":\"User Register Fail\"\n}";

    public static final String RES_UserLoginFail = "{\n\t\"code\":4,\n\t\"message\":\"User Login Fail\"\n}";

    public static final String RES_DuplicateShareCode = "{\n\t\"code\":5,\n\t\"message\":\"Duplicate Share Code\"\n}";

    public static final String RES_ShareCodeNotExists = "{\n\t\"code\":6,\n\t\"message\":\"Share Code not exists\"\n}";

    public static final String RES_AccessTokenNotExists = "{\n\t\"code\":7,\n\t\"message\":\"Access Token not exists\"\n}";

    public static final String RES_AlreadyLinkedMozzi = "{\n\t\"code\":8,\n\t\"message\":\"Requested Mozzi is already linked\"\n}";

    public static final String RES_MozzirollNotExists = "{\n\t\"code\":9,\n\t\"message\":\"Requested Mozziroll not exists\"\n}";

    public static final String RES_BoothNotExists = "{\n\t\"code\":10,\n\t\"message\":\"Requested Booth not exists\"\n}";

    public static final String RES_UnAuthorized = "{\n\t\"code\":11,\n\t\"message\":\"You are not authorized\"\n}";

    public static final String RES_InvalidSessionId = "{\n\t\"code\":12,\n\t\"message\":\"Invalid Session Id\"\n}";

    public static final String RES_NoData = "{\n\t\"code\":13,\n\t\"message\":\"You requested without any data\"\n}";

    public static final String RES_UserEmailNotExists = "{\n\t\"code\":14,\n\t\"message\":\"User don't have email information\"\n}";

    public static final String RES_FileAlreadyExists = "{\n\t\"code\":15,\n\t\"message\":\"Requested File already exists\"\n}";

    public static final String RES_FileNotExists = "{\n\t\"code\":16,\n\t\"message\":\"Requested File does not exist\"\n}";

    public static final String RES_InvalidAccessToken = "{\n\t\"code\":17,\n\t\"message\":\"Invalid Access Token\"\n}";

    public static final String RES_ClosedBooth = "{\n\t\"code\":18,\n\t\"message\":\"Requested booth is closed\"\n}";

    public static final String RES_FrameNotExists = "{\n\t\"code\":19,\n\t\"message\":\"Requested Frame is closed\"\n}";

    @Bean
    public OpenAPI openApi(@Value("$springdoc.version") String springdocVersion) {
        io.swagger.v3.oas.models.info.Info info = new io.swagger.v3.oas.models.info.Info()
            .title("Mozzi")
            .version(springdocVersion)
            .description("Mozzi API");

        Schema<Map<String, Object>> InternalSchema = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.InternalServerError.getCode()))
            .addProperty("message", new StringSchema().example("General Internal Server Error"));

        Schema<Map<String, Object>> UserIdNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UserIdNotExists.getCode()))
            .addProperty("message", new StringSchema().example("User Id Not exists"));

        Schema<Map<String, Object>> InvalidRefreshToken = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.InvalidRefreshToken.getCode()))
            .addProperty("message", new StringSchema().example("Refresh Token is not valid"));

        Schema<Map<String, Object>> UserRegisterFail = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UserRegisterFail.getCode()))
            .addProperty("message", new StringSchema().example("User Register Fail"));

        Schema<Map<String, Object>> UserLoginFail = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UserLoginFail.getCode()))
            .addProperty("message", new StringSchema().example("User Login Fail"));

        Schema<Map<String, Object>> DuplicateShareCode = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.DuplicateShareCode.getCode()))
            .addProperty("message", new StringSchema().example("Duplicate Share Code"));

        Schema<Map<String, Object>> ShareCodeNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.ShareCodeNotExists.getCode()))
            .addProperty("message", new StringSchema().example("Share Code not exists"));

        Schema<Map<String, Object>> AccessTokenNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.AccessTokenNotExists.getCode()))
            .addProperty("message", new StringSchema().example("Access Token not exists"));

        Schema<Map<String, Object>> AlreadyLinkedMozzi = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.AlreadyLinkedMozzi.getCode()))
            .addProperty("message", new StringSchema().example("Requested Mozzi is already linked"));

        Schema<Map<String, Object>> MozzirollNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.MozzirollNotExists.getCode()))
            .addProperty("message", new StringSchema().example("Requested Mozziroll not exists"));

        Schema<Map<String, Object>> BoothNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.BoothNotExists.getCode()))
            .addProperty("message", new StringSchema().example("Requested Booth not exists"));

        Schema<Map<String, Object>> UnAuthorized = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UnAuthorized.getCode()))
            .addProperty("message", new StringSchema().example("You are not authorized"));

        Schema<Map<String, Object>> InvalidSessionId = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.InvalidSessionId.getCode()))
            .addProperty("message", new StringSchema().example("Requested Session not exists"));

        Schema<Map<String, Object>> NoData = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.NoData.getCode()))
            .addProperty("message", new StringSchema().example("You requested without any data"));

        Schema<Map<String, Object>> UserEmailNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.UserEmailNotExists.getCode()))
            .addProperty("message", new StringSchema().example("User don't have email information"));

        Schema<Map<String, Object>> FileAlreadyExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.FileAlreadyExists.getCode()))
            .addProperty("message", new StringSchema().example("Requested File already exists"));

        Schema<Map<String, Object>> FileNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.FileNotExists.getCode()))
            .addProperty("message", new StringSchema().example("Requested File does not exist"));

        Schema<Map<String, Object>> InvalidAccessToken = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.InvalidAccessToken.getCode()))
            .addProperty("message", new StringSchema().example("Invalid Access Token"));

        Schema<Map<String, Object>> FrameNotExists = new Schema<Map<String, Object>>()
            .addProperty("code", new IntegerSchema().example(MozziAPIErrorCode.FrameNotExists.getCode()))
            .addProperty("message", new StringSchema().example("Frame not Exists"));

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
            .addSchemas("InvalidSessionId", InvalidSessionId)
            .addSchemas("NoData", NoData)
            .addSchemas("UserEmailNotExists", UserEmailNotExists)
            .addSchemas("FileAlreadyExists", FileAlreadyExists)
            .addSchemas("FileNotExists", FileNotExists)
            .addSchemas("InvalidAccessToken", InvalidAccessToken)
            .addSchemas("FrameNotExists", FrameNotExists);

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