package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 사용자의 email이 필요하나, email이 존재하지 않을 때 발생하는 Exception 입니다 (Mozzi code : 14, Http Status 400)
 */
public class UserEmailNotExists extends RuntimeException {
    public UserEmailNotExists(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 14;

    public static class UserEmailNotExistsResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private static final int code = MOZZI_CODE;

        public UserEmailNotExistsResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
