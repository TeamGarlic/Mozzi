package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 요청 받은 share code에 해당 되는 부스가 존재하지 않을 때 발생되는 Exception입니다. (Mozzi code : 6, Http Status 400)
 */
public class ShareCodeNotExistException extends RuntimeException {
    public ShareCodeNotExistException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 6;

    public static class ShareCodeNotExistResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public ShareCodeNotExistResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
