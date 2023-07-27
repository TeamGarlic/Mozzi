package com.ssafy.mozzi.common.exception.handler;

/**
 * RefreshToken이 유효하지 않을 때 발생하는 Exception입니다.
 */
public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException(String message) {
        super(message);
    }
}
