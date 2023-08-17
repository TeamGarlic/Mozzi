package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.exception.ErrorResponse;
import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BaseException extends RuntimeException {
    private MozziAPIErrorCode code; // Mozzi API Error Code
    private String message; // Mozzi API Error message
    private String log; // Internal Logging message (nullable)

    public BaseException(MozziAPIErrorCode code, String message) {
        this.code = code;
        this.message = message;
        this.log = null;
    }

    public BaseException(MozziAPIErrorCode code, String message, String log) {
        this.code = code;
        this.message = message;
        this.log = log;
    }

    public ErrorResponse toResponse() {
        return ErrorResponse.builder()
            .code(code)
            .message(message)
            .build();
    }
}
