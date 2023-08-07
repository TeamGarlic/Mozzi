package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 필요한 데이터가 전부 없을 때 발생하는 예외입니다. (Mozzi code : 13, Http Status 400)
 */
public class NoDataException extends RuntimeException {
    public NoDataException(String message) {
        super(message);
    }

    private static final int MOZZI_CODE = 13;

    public static class NoDataResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public NoDataResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
