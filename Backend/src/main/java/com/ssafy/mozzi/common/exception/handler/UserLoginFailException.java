package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Password 불일치로 로그인이 실패하였을 때 발생하는 Exception 입니다. (Mozzi code : 4, Http Status 400)
 */
public class UserLoginFailException extends RuntimeException {
    public UserLoginFailException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 4;

    public static class UserLoginFailResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public UserLoginFailResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
