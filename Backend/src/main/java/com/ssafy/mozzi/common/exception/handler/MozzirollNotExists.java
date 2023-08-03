package com.ssafy.mozzi.common.exception.handler;

/**
 * 요청 받은 MozziRoll이 없을 때 발생하는 예외입니다.
 */
public class MozzirollNotExists extends RuntimeException {
    public MozzirollNotExists(String message) {
        super(message);
    }
}
