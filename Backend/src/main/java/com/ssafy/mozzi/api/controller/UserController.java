package com.ssafy.mozzi.api.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.mozzi.api.request.ReIssuePostReq;
import com.ssafy.mozzi.api.request.UserLoginPostReq;
import com.ssafy.mozzi.api.request.UserRegisterPostReq;
import com.ssafy.mozzi.api.response.ReIssuePostRes;
import com.ssafy.mozzi.api.response.UserIdCheckRes;
import com.ssafy.mozzi.api.response.UserInfoRes;
import com.ssafy.mozzi.api.response.UserLoginPostRes;
import com.ssafy.mozzi.api.response.UserRegisterPostRes;
import com.ssafy.mozzi.api.service.UserService;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import io.swagger.v3.oas.annotations.Operation;
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
public class UserController {
    private final UserService userService;

    /**
     * 회원 가입을 위한 POST 메소드
     *
     * @param request UserRegisterPostReq
     * @return ResponseEntity<? extends BaseResponseBody> with UserRegisterPostRes
     * @see UserService
     */
    @Operation(summary = "회원 가입 API", description = "회원 가입을 위한 POST 메소드")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "success"),
        @ApiResponse(responseCode = "400", description = "bad request")
    })
    @PostMapping("/register")
    public ResponseEntity<? extends BaseResponseBody<UserRegisterPostRes>> register(
        @RequestBody UserRegisterPostReq request) {
        UserRegisterPostRes response = userService.register(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noCache())
            .body(
                BaseResponseBody.<UserRegisterPostRes>builder()
                    .message("User register success")
                    .data(response)
                    .build()
            );
    }

    /**
     * 로그인을 위한 POST 메소드
     *
     * @param request UserLoginPostReq
     * @return ResponseEntity<? extends BaseResponseBody> with UserLoginPostRes
     * @see UserService
     */
    @PostMapping("/login")
    public ResponseEntity<? extends BaseResponseBody<UserLoginPostRes>> login(@RequestBody UserLoginPostReq request) {
        UserLoginPostRes response = userService.login(request);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                BaseResponseBody.<UserLoginPostRes>builder()
                    .message("User login success")
                    .data(response)
                    .build()
            );
    }

    /**
     * 토큰 재발급을 위한 POST 메소드
     *
     * @param request reissuePostReq
     * @return ResponseEntity<? extends BaseResponseBody> with reissuePostRes
     * @see com.ssafy.mozzi.common.auth.JwtTokenProvider
     */
    @PostMapping("/reissue")
    public ResponseEntity<? extends BaseResponseBody<ReIssuePostRes>> reissue(@RequestBody ReIssuePostReq request) {
        ReIssuePostRes response = userService.reissue(request);
        return new ResponseEntity<>(
            BaseResponseBody.<ReIssuePostRes>builder()
                .message("reissue access token by refresh token")
                .data(response)
                .build(), HttpStatus.OK);
    }

    /**
     * 사용자에게 입력 받은 user id가 사용 가능한지 확인하여 반환합니다.
     * @param userId 사용자가 입력한 id
     * @see UserService
     */
    @GetMapping("/check-login-id")
    public ResponseEntity<? extends BaseResponseBody<UserIdCheckRes>> userIdCheck(@RequestParam String userId) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                userService.userIdCheck(userId)
            );
    }

    /**
     * 입력 받은 Token 에 해당하는 정보룰 반환합니다.
     * @param accessToken 사용자의 Token
     * @see UserService
     */
    @GetMapping()
    public ResponseEntity<? extends BaseResponseBody<UserInfoRes>> userInfo(
        @RequestHeader("Authorization") String accessToken) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                userService.getUserInfo(accessToken)
            );
    }

    /**
     * 입력 받은 Token 에 해당하는 유저의 리프레쉬 토큰을 초기화 합니다.
     * @param accessToken 사용자의 Token
     * @see UserService
     */
    @GetMapping("/logout")
    public ResponseEntity<? extends BaseResponseBody<String>> logout(
        @RequestHeader("Authorization") String accessToken) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                userService.logout(accessToken)
            );
    }
}