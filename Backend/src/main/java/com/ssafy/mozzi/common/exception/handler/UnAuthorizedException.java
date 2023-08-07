package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 요청 된 작업을 처리하기에 권한이 부족할 때 발생하는 예외입니다. (Mozzi code : 11, Http Status 401)
 */
public class UnAuthorizedException extends RuntimeException {
    public UnAuthorizedException(String message) {
        super(message);
    }

    private static final int MOZZI_CODE = 11;

    public static class UnAuthorizedResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public UnAuthorizedResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
