package com.ssafy.mozzi.common.exception.handler;

/**
 * Password 불일치로 로그인이 실패하였을 때 발생하는 Exception 입니다.
 */
public class UserLoginFailException extends RuntimeException {
    public UserLoginFailException(String message) {
        super(message);
    }
}
