package com.ssafy.mozzi.common.exception;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BaseException extends RuntimeException {
    private MozziAPIErrorCode code; // Mozzi API Error Code
    private String message; // Mozzi API Error message
    private String log; // Internal Logging message (nullable)

    BaseException(MozziAPIErrorCode code, String message) {
        this.code = code;
        this.message = message;
        this.log = null;
    }

    BaseException(MozziAPIErrorCode code, String message, String log) {
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
