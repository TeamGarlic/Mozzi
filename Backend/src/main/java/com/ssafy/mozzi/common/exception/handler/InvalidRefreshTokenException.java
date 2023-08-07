package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * RefreshToken이 유효하지 않을 때 발생하는 Exception입니다. (Mozzi code : 2, Http Status 400)
 */
public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException(String message) {
        super(message);
    }

    private static final int MOZZI_CODE = 2;

    public static class InvalidRefreshTokenResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public InvalidRefreshTokenResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
