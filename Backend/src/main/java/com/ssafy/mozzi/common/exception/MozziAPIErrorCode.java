package com.ssafy.mozzi.common.exception;

import com.fasterxml.jackson.annotation.JsonValue;

public enum MozziAPIErrorCode {
    InternalServerError(0),
    UserIdNotExists(1),
    InvalidRefreshToken(2),
    UserRegisterFail(3),
    UserLoginFail(4),
    DuplicateShareCode(5),
    ShareCodeNotExists(6),
    AccessTokenNotExists(7),
    AlreadyLinkedMozzi(8),
    MozzirollNotExists(9),
    BoothNotExists(10),
    UnAuthorized(11),
    InvalidSessionId(12),
    NoData(13),
    UserEmailNotExists(14),
    FileAlreadyExists(15),
    FileNotExists(16),
    InvalidAccessToken(17),
    ClosedBooth(18);

    @JsonValue
    private final int code;

    MozziAPIErrorCode(int code) {
        this.code = code;
    }

    public int getCode() {
        return this.code;
    }
}
