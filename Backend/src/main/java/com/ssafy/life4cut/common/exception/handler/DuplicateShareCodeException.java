package com.ssafy.life4cut.common.exception.handler;

/**
 * 이미 생성된 공유 코드를 이용하여 부스를 만들고자 할 때 발생되는 Exception 입니다.
 */
public class DuplicateShareCodeException extends RuntimeException {
    public DuplicateShareCodeException(String message) {
        super(message);
    }
}
