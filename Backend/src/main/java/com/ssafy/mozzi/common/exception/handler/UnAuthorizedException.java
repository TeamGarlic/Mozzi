package com.ssafy.mozzi.common.exception.handler;

import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;

/**
 * Access Token이 필요하나 존재하지 않을 때 (AccessTokenNotExists, 7)
 * 요청을 처리하는데 필요한 권한이 존재하지 않는 경우 (UnAuthorized, 11)
 */
public class UnAuthorizedException extends BaseException {
    public UnAuthorizedException(MozziAPIErrorCode code, String message) {
        super(code, message);
    }

    UnAuthorizedException(MozziAPIErrorCode code, String message, String log) {
        super(code, message, log);
    }
}
