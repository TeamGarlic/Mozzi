package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Jwt Access Token이 존재하지 않아 발생하는 예외입니다. (Mozzi code : 7, Http Status 401)
 */
public class AccessTokenNotExistsException extends RuntimeException {
    public AccessTokenNotExistsException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 7;

    public static class AccessTokenNotExistsResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        public final int code = MOZZI_CODE;

        public AccessTokenNotExistsResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
