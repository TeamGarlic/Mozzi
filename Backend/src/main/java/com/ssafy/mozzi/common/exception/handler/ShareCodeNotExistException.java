package com.ssafy.mozzi.common.exception.handler;

/**
 * 요청 받은 share code에 해당 되는 부스가 존재하지 않을 때 발생되는 Exception입니다.
 */
public class ShareCodeNotExistException extends RuntimeException {
    public ShareCodeNotExistException(String message) {
        super(message);
    }
}
