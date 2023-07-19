package com.ssafy.life4cut.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.life4cut.api.request.UserRegisterPostReq;
import com.ssafy.life4cut.api.response.UserRegisterPostRes;
import com.ssafy.life4cut.api.service.UserService;
import com.ssafy.life4cut.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

/**
 * 유저 관련 API 요청을 위한 Controller
 */
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
    @PostMapping("/register")
    public ResponseEntity<? extends BaseResponseBody> register(@RequestBody UserRegisterPostReq request) {
        UserRegisterPostRes response = userService.register(request);
        return new ResponseEntity<>(
            BaseResponseBody.<UserRegisterPostRes>builder()
                .message("success")
                .data(response)
                .build(), HttpStatus.CREATED);
    }
}

