package com.ssafy.mozzi.common.exception.handler;

/**
 * 로그인하고자하는 user의 id가 존재하지 않을 때 발생하는 Exception 입니다
 */
public class UserIdNotExistsException extends RuntimeException {
    public UserIdNotExistsException(String message) {
        super(message);
    }
}
