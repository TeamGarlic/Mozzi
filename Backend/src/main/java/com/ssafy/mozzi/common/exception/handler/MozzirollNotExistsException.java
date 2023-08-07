package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 요청 받은 MozziRoll이 없을 때 발생하는 예외입니다. (Mozzi code : 9, Http Status 404)
 */
public class MozzirollNotExistsException extends RuntimeException {
    public MozzirollNotExistsException(String message) {
        super(message);
    }

    private static final int MOZZI_CODE = 9;

    public static class MozzirollNotExistsResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public MozzirollNotExistsResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
