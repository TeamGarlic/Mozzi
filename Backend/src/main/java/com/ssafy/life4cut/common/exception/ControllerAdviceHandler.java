package com.ssafy.life4cut.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.life4cut.common.exception.handler.DuplicateShareCodeException;
import com.ssafy.life4cut.common.exception.handler.DuplicatedUserIdException;
import com.ssafy.life4cut.common.exception.handler.InvalidRefreshTokenException;
import com.ssafy.life4cut.common.exception.handler.ShareCodeNotExistException;
import com.ssafy.life4cut.common.exception.handler.UserIdNotExistsException;
import com.ssafy.life4cut.common.exception.handler.UserLoginFailException;
import com.ssafy.life4cut.common.model.response.BaseResponseBody;

import lombok.extern.slf4j.Slf4j;

/**
 * REST Controller에서 발생되는 Exception을 처리하기 위한 Controller Advice 입니다.
 */
@RestControllerAdvice
@Slf4j
public class ControllerAdviceHandler {
    /**
     * 이미 존재하는 Id일 경우의 응답을 반환한다.
     * @see UserIdNotExistsException
     * @see com.ssafy.life4cut.api.service.UserService
     */
    @ExceptionHandler(UserIdNotExistsException.class)
    public ResponseEntity<BaseResponseBody> handleUserIdNotExistsException(UserIdNotExistsException exception) {
        log.error("[UserIdNotExistsException] : {}", exception.getMessage());
        return new ResponseEntity<>(
            BaseResponseBody.builder()
                .message("User ID not exists.")
                .build(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<BaseResponseBody> handleInvalidRefreshTokenException(InvalidRefreshTokenException ex) {
        String errorMessage = "Invalid Refresh Token: " + ex.getMessage();
        return new ResponseEntity<>(
            BaseResponseBody.builder()
                .message(errorMessage)
                .build(), HttpStatus.BAD_REQUEST);
    }

    /**
     * 중복된 ID가 존재할 경우의 응답을 반환한다.
     * @see DuplicatedUserIdException
     * @see com.ssafy.life4cut.api.service.UserService
     */
    @ExceptionHandler(DuplicatedUserIdException.class)
    public ResponseEntity<BaseResponseBody> handleDuplicateUserIdException(DuplicatedUserIdException exception) {
        log.error("[DuplicatedUserIdException] : {}", exception.getMessage());
        return new ResponseEntity<>(
            BaseResponseBody.builder()
                .message("You requested duplicated User ID")
                .build(), HttpStatus.BAD_REQUEST
        );
    }

    /**
     * 사용자 로그인에 실패한 경우의 응답을 반환한다
     * @see UserLoginFailException
     * @see com.ssafy.life4cut.api.service.UserService
     */
    @ExceptionHandler(UserLoginFailException.class)
    public ResponseEntity<BaseResponseBody> handleUserLoginFailException(UserLoginFailException exception) {
        log.error("[UserLoginFailException] : {}", exception.getMessage());
        return new ResponseEntity<>(
            BaseResponseBody.builder()
                .message("User login failure")
                .build(), HttpStatus.BAD_REQUEST
        );
    }

    /**
     * 중복된 공유 코드가 존재할 경우의 응답을 반환한다.
     * @see DuplicateShareCodeException
     * @see com.ssafy.life4cut.api.service.BoothService
     */
    @ExceptionHandler(DuplicateShareCodeException.class)
    public ResponseEntity<BaseResponseBody> handleDuplicatedShareCodeException(DuplicateShareCodeException exception) {
        log.error("[DuplicateShareCodeException] : {}", exception.getMessage());
        return new ResponseEntity<>(
            BaseResponseBody.builder()
                .message("You requested duplicated share code")
                .build(), HttpStatus.BAD_REQUEST
        );
    }

    /**
     * 공유 코드가 존재하지 않을 경우의 응답을 반환한다.
     * @see ShareCodeNotExistException
     * @see com.ssafy.life4cut.api.service.BoothService
     */
    @ExceptionHandler(ShareCodeNotExistException.class)
    public ResponseEntity<BaseResponseBody> handleShareCodeNotExistException(ShareCodeNotExistException exception) {
        log.error("[ShareCodeNotExistException] : {}", exception.getMessage());
        return new ResponseEntity<>(
            BaseResponseBody.builder()
                .message("Requested share code not exist")
                .build(), HttpStatus.BAD_REQUEST
        );
    }

    /**
     * 처리 되지 않은 모든 예외에 대한 응답을 반환합니다.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponseBody> handleGenerealException(Exception exception) {
        log.error("Uncaught Exception : {}", exception.getMessage());
        StringBuilder stackTrace = new StringBuilder();
        for (StackTraceElement element : exception.getStackTrace()) {
            stackTrace.append(element.toString()).append("\n");
        }
        log.error("{}", stackTrace);
        return new ResponseEntity<>(
            BaseResponseBody.builder()
                .message("Internal Server Error")
                .build(), HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
