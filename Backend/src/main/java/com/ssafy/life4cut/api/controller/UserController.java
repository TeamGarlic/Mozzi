package com.ssafy.life4cut.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.life4cut.api.request.UserLoginPostReq;
import com.ssafy.life4cut.api.request.UserRegisterPostReq;
import com.ssafy.life4cut.api.request.reissuePostReq;
import com.ssafy.life4cut.api.response.UserLoginPostRes;
import com.ssafy.life4cut.api.response.UserRegisterPostRes;
import com.ssafy.life4cut.api.response.reissuePostRes;
import com.ssafy.life4cut.api.service.UserService;
import com.ssafy.life4cut.common.model.response.BaseResponseBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * 유저 관련 API 요청을 위한 Controller
 */
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
    public ResponseEntity<? extends BaseResponseBody> register(@RequestBody UserRegisterPostReq request) {
        UserRegisterPostRes response = userService.register(request);
        return new ResponseEntity<>(
            BaseResponseBody.<UserRegisterPostRes>builder()
                .message("success")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    /**
     * 로그인을 위한 POST 메소드
     *
     * @param request UserLoginPostReq
     * @return ResponseEntity<? extends BaseResponseBody> with UserLoginPostRes
     * @see UserService
     */
    @PostMapping("/login")
    public ResponseEntity<? extends BaseResponseBody> login(@RequestBody UserLoginPostReq request) {
        UserLoginPostRes response = userService.login(request);

        return new ResponseEntity<>(
            BaseResponseBody.<UserLoginPostRes>builder()
                .message("")
                .data(response)
                .build(), HttpStatus.OK);
    }

    /**
     * 토큰 재발급을 위한 POST 메소드
     *
     * @param request reissuePostReq
     * @return ResponseEntity<? extends BaseResponseBody> with reissuePostRes
     * @see com.ssafy.life4cut.common.auth.JwtTokenProvider
     */
    @PostMapping("/reissue")
    public ResponseEntity<? extends BaseResponseBody<reissuePostRes>> reissue(@RequestBody reissuePostReq request) {
        reissuePostRes response = userService.reissue(request);
        return new ResponseEntity<>(
            BaseResponseBody.<reissuePostRes>builder()
                .message("reissue access token by refresh token")
                .data(response)
                .build(), HttpStatus.OK);
    }
}

