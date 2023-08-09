package com.ssafy.mozzi.common.exception;

public class NotFoundException extends BaseException {

    public NotFoundException(MozziAPIErrorCode code, String message) {
        super(code, message);
    }

    public NotFoundException(MozziAPIErrorCode code, String message, String log) {
        super(code, message, log);
    }
}
