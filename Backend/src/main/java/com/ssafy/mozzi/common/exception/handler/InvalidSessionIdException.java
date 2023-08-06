package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 요청된 Session Id에 해당 되는 Openvidu Session이 존재하지 않을 때 발생되는 예외입니다. (Mozzi code : 12, Http Status 400)
 * @see io.openvidu.java.client.Session
 */
public class InvalidSessionIdException extends RuntimeException {
    public InvalidSessionIdException(String message) {
        super(message);
    }

    public static final int MOZZI_CODE = 12;

    public static class InvalidSessionIdResponse extends BaseErrorResponse {
        @Schema(defaultValue = "" + MOZZI_CODE)
        private final int code = MOZZI_CODE;

        public InvalidSessionIdResponse(String message) {
            this.setMessage(message);
        }
    }
}
