package com.ssafy.mozzi.common.exception.handler;

/**
 * Jwt Access Token이 존재하지 않아 발생하는 예외입니다.
 */
public class AccessTokenNotExistsException extends RuntimeException {
    public AccessTokenNotExistsException(String message) {
        super(message);
    }
}
