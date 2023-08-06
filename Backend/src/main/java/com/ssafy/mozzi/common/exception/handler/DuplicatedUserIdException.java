package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 이미 존재하는 user id로 회원가입을 시도했을 때 발생하는 Exception 입니다 (Mozzi code : 3, Http Status 400)
 */
public class DuplicatedUserIdException extends RuntimeException {
    public DuplicatedUserIdException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 3;

    public static class DuplicatedUserIdResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public DuplicatedUserIdResponse(String message) {
            this.setMessage(message);
        }
    }
}
