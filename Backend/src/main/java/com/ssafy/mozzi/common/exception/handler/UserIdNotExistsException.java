package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 로그인하고자하는 user의 id가 존재하지 않을 때 발생하는 Exception 입니다 (Mozzi code : 1, Http Status 404)
 */
public class UserIdNotExistsException extends RuntimeException {
    public UserIdNotExistsException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 1;

    public static class UserIdNotExistsResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public UserIdNotExistsResponse(String message) {
            this.setMessage(message);
        }
    }
}
