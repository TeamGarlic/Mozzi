package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 사용자 회원가입에 실패한 경우의 Exception 입니다 (Mozzi code : 3, Http Status 400)
 */
public class UserRegisterException extends RuntimeException {
    public UserRegisterException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 3;

    public static class UserRegisterResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public UserRegisterResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
