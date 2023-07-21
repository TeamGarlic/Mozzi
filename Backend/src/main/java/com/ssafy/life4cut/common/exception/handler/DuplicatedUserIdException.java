package com.ssafy.life4cut.common.exception.handler;

/**
 * 이미 존재하는 user id로 회원가입을 시도했을 때 발생하는 Exception 입니다
 */
public class DuplicatedUserIdException extends RuntimeException {
    public DuplicatedUserIdException(String message) {
        super(message);
    }
}
