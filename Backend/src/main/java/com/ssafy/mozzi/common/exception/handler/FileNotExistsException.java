package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 존재하지 않는 파일을 요청했을 때 발생하는 예외입니다. (Mozzi code : 16, Http Status 400)
 */
public class FileNotExistsException extends RuntimeException {
    public FileNotExistsException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 16;

    public static class FileNotExistsResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public FileNotExistsResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
