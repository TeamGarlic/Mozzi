package com.ssafy.mozzi.common.exception.handler;

/**
 * MozziRoll이 이미 사용자에게 연결 되어있는 경우 발생하는 예외입닏다.
 */
public class AlreadyLinkedMozziException extends RuntimeException {
    public AlreadyLinkedMozziException(String message) {
        super(message);
    }
}
