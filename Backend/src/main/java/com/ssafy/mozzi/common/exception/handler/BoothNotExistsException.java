package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 요청한 부스가 존재하지 않을 때 발생하는 예외입니다. (Mozzi code : 10, Http Status 404)
 */
public class BoothNotExistsException extends RuntimeException {
    public BoothNotExistsException(String message) {
        super(message);
    }

    private static final int MOZZI_CODE = 10;

    public static class BoothNotExistsResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public BoothNotExistsResponse(String message) {
            this.setMessage(message);
        }
    }
}
