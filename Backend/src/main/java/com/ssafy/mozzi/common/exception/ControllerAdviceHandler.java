package com.ssafy.mozzi.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;
import com.ssafy.mozzi.common.exception.handler.UserEmailNotExists;
import com.ssafy.mozzi.common.exception.handler.UserIdNotExistsException;
import com.ssafy.mozzi.common.exception.handler.UserLoginFailException;
import com.ssafy.mozzi.common.exception.handler.UserRegisterException;
import com.ssafy.mozzi.common.model.response.BaseErrorResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * REST Controller에서 발생되는 Exception을 처리하기 위한 Controller Advice 입니다.
 */
@RestControllerAdvice
@Slf4j
public class ControllerAdviceHandler {

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
    @ExceptionHandler(BadRequestException.class) // 400
    public ResponseEntity<ErrorResponse> handleBadRequests(BadRequestException exception) {
        MozziAPIErrorCode code = exception.getCode();
        if (exception.getLog() != null) {
            log.info("{} : {}", code.name(), exception.getLog());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(exception.toResponse());
    }

    /**
     * Access Token이 필요하나 존재하지 않을 때 (AccessTokenNotExists, 7)
     * 요청을 처리하는데 필요한 권한이 존재하지 않음 (UnAuthorized, 11)
     */
    @ExceptionHandler(UnAuthorizationException.class) // 401
    public ResponseEntity<ErrorResponse> handleUnAuthorization(UnAuthorizationException exception) {
        MozziAPIErrorCode code = exception.getCode();
        if (exception.getLog() != null) {
            log.info("{} : {}", code.name(), exception.getLog());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(exception.toResponse());
    }

    /**
     * 이미 존재하는 Id일 경우 (UserIdNotExists, 1)
     * 요청한 모찌롤이 존재하지 않을 때 (MozzirollNotExists, 9)
     * 요청한 부스가 존재하지 않을 때 (BoothNotExists, 10)
     * 사용자의 email이 필요하나, email이 존재하지 않을 때 (UserEmailNotExists, 14)
     */
    @ExceptionHandler(NotFoundException.class) // 404
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException exception) {
        MozziAPIErrorCode code = exception.getCode();
        if (exception.getLog() != null) {
            log.info("{} : {}", code.name(), exception.getLog());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(exception.toResponse());
    }

    /**
     * 처리 되지 않은 모든 예외에 대한 응답을 반환합니다. (Mozzi code : 0, Http Status 500)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception exception) {
        log.error("Uncaught Exception : {}", exception.getMessage());
        StringBuilder stackTrace = new StringBuilder();
        for (StackTraceElement element : exception.getStackTrace()) {
            stackTrace.append(element.toString()).append("\n");
        }
        log.error("{}", stackTrace);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(MozziAPIErrorCode.InternalServerError, "General Internal Server Error"));
    }

    /**
     * Oracle Cloud Stroage 관련 Internal Server Error를 반환합니다. (Mozzi code : 0, Http Status 500)
     */
    @ExceptionHandler(CloudStorageSaveFailException.class)
    public ResponseEntity<ErrorResponse> handleCloudStorageSaveFailException(
        CloudStorageSaveFailException exception) {
        log.error("[CloudStorageSaveFailException] : {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(MozziAPIErrorCode.InternalServerError,
                "Internal Server Error - " + exception.getMessage()));
    }


    /**
     * 이미 존재하는 Id일 경우의 응답을 반환한다. (Mozzi code : 1, Http Status 404)
     * @see UserIdNotExistsException
     * @see com.ssafy.mozzi.api.service.UserService
     */
    @ExceptionHandler(UserIdNotExistsException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleUserIdNotExistsException(
        UserIdNotExistsException exception) {
        log.error("[UserIdNotExistsException] : {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new UserIdNotExistsException.UserIdNotExistsResponse("User ID not exists."));
    }


    /**
     * 중복된 ID가 존재할 경우의 응답을 반환한다. (Mozzi code : 3, Http Status 400)
     * @see UserRegisterException
     * @see com.ssafy.mozzi.api.service.UserService
     */
    @ExceptionHandler(UserRegisterException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleDuplicateUserIdException(
        UserRegisterException exception) {
        log.error("[DuplicatedUserIdException] : {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new UserRegisterException.UserRegisterResponse("You requested duplicated User ID"));
    }

    /**
     * 사용자 로그인에 실패한 경우의 응답을 반환한다 (Mozzi code : 4, Http Status 400)
     * @see UserLoginFailException
     * @see com.ssafy.mozzi.api.service.UserService
     */
    @ExceptionHandler(UserLoginFailException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleUserLoginFailException(UserLoginFailException exception) {
        log.error("[UserLoginFailException] : {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new UserLoginFailException.UserLoginFailResponse("User login failure"));
    }




    /**
     * 사용자의 email이 필요하나, email이 존재하지 않을 때 발생하는 Exception 입니다 (Mozzi code : 14, Http Status 404)
     */
    @ExceptionHandler(UserEmailNotExists.class)
    public ResponseEntity<? extends BaseErrorResponse> handleUserEmailNotExists(UserEmailNotExists exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new UserRegisterException.UserRegisterResponse(exception.getMessage()));
    }
}
