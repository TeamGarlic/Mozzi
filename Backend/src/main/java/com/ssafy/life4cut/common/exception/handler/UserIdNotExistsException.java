package com.ssafy.life4cut.common.exception.handler;

public class UserIdNotExistsException extends RuntimeException {
    public UserIdNotExistsException(String message) {
        super(message);
    }
}
