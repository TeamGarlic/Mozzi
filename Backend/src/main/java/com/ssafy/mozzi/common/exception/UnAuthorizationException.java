package com.ssafy.mozzi.common.exception;

public class UnAuthorizationException extends BaseException {
    public UnAuthorizationException(MozziAPIErrorCode code, String message) {
        super(code, message);
    }

    UnAuthorizationException(MozziAPIErrorCode code, String message, String log) {
        super(code, message, log);
    }
}
