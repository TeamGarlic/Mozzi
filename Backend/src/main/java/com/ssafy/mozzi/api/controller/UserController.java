package com.ssafy.mozzi.api.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.mozzi.api.request.ReIssuePostReq;
import com.ssafy.mozzi.api.request.UserLoginPostReq;
import com.ssafy.mozzi.api.request.UserPasswordResetPostReq;
import com.ssafy.mozzi.api.request.UserRegisterPostReq;
import com.ssafy.mozzi.api.request.UserUpdatePutReq;
import com.ssafy.mozzi.api.response.ReIssuePostRes;
import com.ssafy.mozzi.api.response.UserIdCheckRes;
import com.ssafy.mozzi.api.response.UserInfoRes;
import com.ssafy.mozzi.api.response.UserLoginPostRes;
import com.ssafy.mozzi.api.response.UserPasswordResetPostRes;
import com.ssafy.mozzi.api.response.UserRegisterPostRes;
import com.ssafy.mozzi.api.response.UserUpdateRes;
import com.ssafy.mozzi.api.service.UserService;
import com.ssafy.mozzi.common.exception.handler.InvalidRefreshTokenException;
import com.ssafy.mozzi.common.exception.handler.NoDataException;
import com.ssafy.mozzi.common.exception.handler.UserEmailNotExists;
import com.ssafy.mozzi.common.exception.handler.UserIdNotExistsException;
import com.ssafy.mozzi.common.exception.handler.UserLoginFailException;
import com.ssafy.mozzi.common.exception.handler.UserRegisterException;
import com.ssafy.mozzi.common.model.response.BaseErrorResponse;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * 유저 관련 API 요청을 위한 Controller
 */
@CrossOrigin("*")
@Tag(name = "User", description = "유저 관련 api 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Tag(name = "User 컨트롤러", description = "사용자를 관리하는 컨트롤러 입니다.")
public class UserController {
    private final UserService userService;

    /**
     * 회원 가입을 위한 POST 메소드
     *
     * @param request UserRegisterPostReq
     * @return ResponseEntity<? extends BaseResponseBody> with UserRegisterPostRes
     * @see UserService
     */
    @Operation(summary = "회원가입", description = "사용자 회원가입 API 입니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "201", description = "회원가입 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "회원가입 실패(잘못된 요청)", content = @Content(schema = @Schema(implementation = UserRegisterException.UserRegisterResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @PostMapping("/register")
    public ResponseEntity<? extends BaseResponseBody<UserRegisterPostRes>> register(
        @RequestBody UserRegisterPostReq request) {

        return ResponseEntity.status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<UserRegisterPostRes>builder()
                .message("User register success")
                .data(userService.register(request))
                .build());
    }

    /**
     * 로그인을 위한 POST 메소드
     *
     * @param request UserLoginPostReq
     * @return ResponseEntity<? extends BaseResponseBody> with UserLoginPostRes
     * @see UserService
     */
    @Operation(summary = "로그인", description = "사용자 로그인 API 입니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "로그인 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "로그인 실패", content = @Content(schema = @Schema(implementation = UserLoginFailException.UserLoginFailResponse.class))),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 User Id", content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @PostMapping("/login")
    public ResponseEntity<? extends BaseResponseBody<UserLoginPostRes>> login(@RequestBody UserLoginPostReq request) {

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<UserLoginPostRes>builder()
                .message("User login success")
                .data(userService.login(request))
                .build());
    }

    /**
     * 토큰 재발급을 위한 POST 메소드
     *
     * @param request reissuePostReq
     * @return ResponseEntity<? extends BaseResponseBody> with reissuePostRes
     * @see com.ssafy.mozzi.common.auth.JwtTokenProvider
     */
    @Operation(summary = "토큰 재발행", description = "Access Token을 재발급 받기 위한 API 입니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Acess Token 재발급 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "유효하지 않은 Refresh Token", content = @Content(schema = @Schema(implementation = InvalidRefreshTokenException.InvalidRefreshTokenResponse.class))),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 User Id", content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @PostMapping("/reissue")
    public ResponseEntity<? extends BaseResponseBody<ReIssuePostRes>> reissue(@RequestBody ReIssuePostReq request) {

        return new ResponseEntity<>(BaseResponseBody.<ReIssuePostRes>builder()
            .message("reissue access token by refresh token")
            .data(userService.reissue(request))
            .build(), HttpStatus.OK);
    }

    /**
     * 사용자에게 입력 받은 user id가 사용 가능한지 확인하여 반환합니다.
     * @param userId 사용자가 입력한 id
     * @see UserService
     */
    @Operation(summary = "User Id Check", description = "요청된 유저 ID가 사용 가능한가 확인합니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "확인 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @GetMapping("/check-login-id")
    public ResponseEntity<? extends BaseResponseBody<UserIdCheckRes>> userIdCheck(@RequestParam String userId) {
        UserIdCheckRes userIdCheckRes = userService.userIdCheck(userId);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<UserIdCheckRes>builder()
                .message(String.format("Requested User ID%s available", (userIdCheckRes.isResult() ? "" : " not")))
                .data(userIdCheckRes)
                .build());
    }

    /**
     * 입력 받은 Token 에 해당하는 정보룰 반환합니다.
     * @param accessToken 사용자의 Token
     * @see UserService
     */
    @Operation(summary = "유저 정보", description = "유저 정보를 반환합니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "유저 정보 조회 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 User Id", content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @GetMapping()
    public ResponseEntity<? extends BaseResponseBody<UserInfoRes>> userInfo(
        @RequestHeader("Authorization") String accessToken) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<UserInfoRes>builder()
                .message("user exists")
                .data(userService.getUserInfo(accessToken))
                .build());
    }

    /**
     * 입력 받은 Token 에 해당하는 유저의 리프레쉬 토큰을 초기화 합니다.
     * @param accessToken 사용자의 Token
     * @see UserService
     */
    @Operation(summary = "로그아웃", description = "유저의 Refresh Token을 Revoke 시킵니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "로그아웃 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 User Id", content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @GetMapping("/logout")
    public ResponseEntity<? extends BaseResponseBody<String>> logout(
        @RequestHeader("Authorization") String accessToken) {
        userService.logout(accessToken);

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<String>builder().message("logout success").data("").build());
    }

    /**
     * 유저 정보 변경 요청을 받아 존재하는 데이터에 대해 데이터를 갱신합니다.
     * @param request
     * @see UserService
     */
    @Operation(summary = "유저 정보 갱신", description = "유저의 정보를 갱신 시킵니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "유저 정보 갱신 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 User Id", content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "404", description = "갱신할 정보가 존재하지 않습니다.", content = @Content(schema = @Schema(implementation = NoDataException.NoDataResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @PatchMapping
    public ResponseEntity<? extends BaseResponseBody<UserUpdateRes>> update(@RequestBody UserUpdatePutReq request) {
        UserUpdateRes userUpdateRes = userService.update(request);

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<UserUpdateRes>builder()
                .message(String.format("User(%s) data updated.", userUpdateRes.getId()))
                .data(userUpdateRes)
                .build());
    }

    @Operation(summary = "유저 패스워드 초기화", description = "유저의 패스워드를 초기화하여 메일로 전송합니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "패스워드 초기화 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 User Id", content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "404", description = "사용자에게 Email 정보가 없는 경우", content = @Content(schema = @Schema(implementation = UserEmailNotExists.UserEmailNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @PostMapping("/reset")
    public ResponseEntity<? extends BaseResponseBody<UserPasswordResetPostRes>> reset(
        @RequestBody UserPasswordResetPostReq request) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<UserPasswordResetPostRes>builder()
                .message(String.format("User %s password reseted", request.getUserId()))
                .data(userService.reset(request.getUserId()))
                .build());
    }

    @Operation(summary = "회원 탈퇴", description = "유저의 accessToken을 입력받아 해당 유저를 탈퇴시킵니다. (soft delete)")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "회원 탈퇴 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 User Id", content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @DeleteMapping
    public ResponseEntity<? extends BaseResponseBody<UserInfoRes>> withdrawUser(
        @RequestHeader("Authorization") String accessToken) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<UserInfoRes>builder()
                .message(String.format("withdraw User success"))
                .data(userService.withdrawUser(accessToken))
                .build());
    }
}