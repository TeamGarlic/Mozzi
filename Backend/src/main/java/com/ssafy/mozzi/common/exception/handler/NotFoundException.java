package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;

/**
 * 이미 존재하는 Id일 경우 (UserIdNotExists, 1)
 * 요청한 모찌롤이 존재하지 않을 때 (MozzirollNotExists, 9)
 * 요청한 부스가 존재하지 않을 때 (BoothNotExists, 10)
 * 사용자의 email이 필요하나, email이 존재하지 않을 때 (UserEmailNotExists, 14)
 */
public class NotFoundException extends BaseException {

    public NotFoundException(MozziAPIErrorCode code, String message) {
        super(code, message);
    }

    public NotFoundException(MozziAPIErrorCode code, String message, String log) {
        super(code, message, log);
    }
}
