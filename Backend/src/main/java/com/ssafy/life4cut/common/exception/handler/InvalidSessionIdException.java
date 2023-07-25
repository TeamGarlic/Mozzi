package com.ssafy.life4cut.common.exception.handler;

/**
 * 요청된 Session Id에 해당 되는 Openvidu Session이 존재하지 않을 때 발생되는 예외입니다.
 * @see io.openvidu.java.client.Session
 */
public class InvalidSessionIdException extends Exception {
    public InvalidSessionIdException(String message) {
        super(message);
    }
}
