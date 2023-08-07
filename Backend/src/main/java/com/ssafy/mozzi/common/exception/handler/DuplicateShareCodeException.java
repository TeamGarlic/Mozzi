package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 이미 생성된 공유 코드를 이용하여 부스를 만들고자 할 때 발생되는 Exception 입니다. (Mozzi code : 5, Http Status 400)
 */
public class DuplicateShareCodeException extends RuntimeException {
    public DuplicateShareCodeException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 5;

    public static class DuplicateShareCodeResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public DuplicateShareCodeResponse(String message) {
            this.setCode(MOZZI_CODE);
            this.setMessage(message);
        }
    }
}
