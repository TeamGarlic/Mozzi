package com.ssafy.mozzi.common.exception;

/**
 * 유효하지 않은 Refresh Token에 대한 응답 (InvalidRefreshToken, 2)
 * 사용자 회원가입에 실패 (UserRegisterFail, 3)
 * 사용자 로그인에 실패 (UserLoginFail, 4)
 * 중복된 공유 코드가 존재 (DuplicateShareCode, 5)
 * 공유 코드가 존재하지 않음 (ShareCodeNotExist, 6)
 * 이미 등록 된 모찌를 등록하려 시도 (AlreadyLinkedMozzi, 8)
 * Session Id에 해당 되는 Openvidu Session이 존재하지 않음 (InvalidSessionId, 12)
 * 필요한 데이터가 전부 없을 때 (NoData, 13)
 * 이미 존재하는 파일을 저장시도 (FileAlreadyExists, 15)
 * 존재하지 않는 파일을 요청 (FileNotExists, 16)
 */
public class BadRequestException extends BaseException {

    BadRequestException(MozziAPIErrorCode code, String message) {
        super(code, message);
    }

    public BadRequestException(MozziAPIErrorCode code, String message, String log) {
        super(code, message, log);
    }
}
