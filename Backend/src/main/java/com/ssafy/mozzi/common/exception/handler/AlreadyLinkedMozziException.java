package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * MozziRoll이 이미 사용자에게 연결 되어있는 경우 발생하는 예외입니다. (Mozzi code : 8, Http Status 400)
 */
public class AlreadyLinkedMozziException extends RuntimeException {
    public AlreadyLinkedMozziException(String message) {
        super(message);
    }

    private static final int MOZZI_CODE = 8;

    public static class AlreadyLinkedMozziResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public AlreadyLinkedMozziResponse(String message) {
            this.setMessage(message);
        }
    }
}
