package com.ssafy.mozzi.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.mozzi.common.exception.handler.AccessTokenNotExistsException;
import com.ssafy.mozzi.common.exception.handler.AlreadyLinkedMozziException;
import com.ssafy.mozzi.common.exception.handler.BoothNotExistsException;
import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;
import com.ssafy.mozzi.common.exception.handler.DuplicateShareCodeException;
import com.ssafy.mozzi.common.exception.handler.InvalidRefreshTokenException;
import com.ssafy.mozzi.common.exception.handler.InvalidSessionIdException;
import com.ssafy.mozzi.common.exception.handler.MozzirollNotExistsException;
import com.ssafy.mozzi.common.exception.handler.NoDataException;
import com.ssafy.mozzi.common.exception.handler.ShareCodeNotExistException;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;
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
     * 유효하지 않은 Refresh Token에 대한 응답 (Mozzi code : 2, Http Status 400)
     * @see InvalidRefreshTokenException
     * @see com.ssafy.mozzi.api.service.UserService
     */
    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleInvalidRefreshTokenException(
        InvalidRefreshTokenException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new InvalidRefreshTokenException.InvalidRefreshTokenResponse(
                "Invalid Refresh Token: " + ex.getMessage()));
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
     * 중복된 공유 코드가 존재할 경우의 응답을 반환한다. (Mozzi code : 5, Http Status 400)
     * @see DuplicateShareCodeException
     * @see com.ssafy.mozzi.api.service.BoothService
     */
    @ExceptionHandler(DuplicateShareCodeException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleDuplicatedShareCodeException(
        DuplicateShareCodeException exception) {
        log.error("[DuplicateShareCodeException] : {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new DuplicateShareCodeException.DuplicateShareCodeResponse("You requested duplicated share code"));
    }

    /**
     * 공유 코드가 존재하지 않을 경우의 응답을 반환한다. (Mozzi code : 6, Http Status 400)
     * @see ShareCodeNotExistException
     * @see com.ssafy.mozzi.api.service.BoothService
     */
    @ExceptionHandler(ShareCodeNotExistException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleShareCodeNotExistException(
        ShareCodeNotExistException exception) {
        log.error("[ShareCodeNotExistException] : {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ShareCodeNotExistException.ShareCodeNotExistResponse("Requested share code not exist"));
    }

    /**
     * 처리 되지 않은 모든 예외에 대한 응답을 반환합니다. (Mozzi code : 0, Http Status 500)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<? extends BaseErrorResponse> handleGenerealException(Exception exception) {
        log.error("Uncaught Exception : {}", exception.getMessage());
        StringBuilder stackTrace = new StringBuilder();
        for (StackTraceElement element : exception.getStackTrace()) {
            stackTrace.append(element.toString()).append("\n");
        }
        log.error("{}", stackTrace);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new BaseErrorResponse.InternalServerErrorResponse("General Internal Server Error"));
    }

    /**
     * Oracle Cloud Stroage 관련 Internal Server Error를 반환합니다. (Mozzi code : 0, Http Status 500)
     */
    @ExceptionHandler(CloudStorageSaveFailException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleCloudStorageSaveFailException(
        CloudStorageSaveFailException exception) {
        log.error("[CloudStorageSaveFailException] : {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(
                new BaseErrorResponse.InternalServerErrorResponse("Internal Server Error - " + exception.getMessage()));
    }

    /**
     * Access Token이 필요하나 존재하지 않을 때의 응답을 반환합니다. (Mozzi code : 7, Http Status 401)
     */
    @ExceptionHandler(AccessTokenNotExistsException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleAccessTokenNotExistsException(
        AccessTokenNotExistsException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new AccessTokenNotExistsException.AccessTokenNotExistsResponse("Access Token Not Exists"));
    }

    /**
     * 이미 등록 된 모찌를 등록하려 시도할 때의 응답을 반환합니다. (Mozzi code : 8, Http Status 400)
     */
    @ExceptionHandler(AlreadyLinkedMozziException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleAlreadyLinkedMozziException(
        AlreadyLinkedMozziException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new AlreadyLinkedMozziException.AlreadyLinkedMozziResponse(exception.getMessage()));
    }

    /**
     * 요청한 모찌롤이 존재하지 않을 때의 응답을 반환합니다. (Mozzi code : 9, Http Status 404)
     */
    @ExceptionHandler(MozzirollNotExistsException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleMozzirollNotExistsException(
        MozzirollNotExistsException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new MozzirollNotExistsException.MozzirollNotExistsResponse(exception.getMessage()));
    }

    /**
     * 요청한 부스가 존재하지 않을 때 응답을 반환합니다. (Mozzi code : 10, Http Status 404)
     */
    @ExceptionHandler(BoothNotExistsException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleBoothNotExists(BoothNotExistsException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new BoothNotExistsException.BoothNotExistsResponse(exception.getMessage()));
    }

    /**
     * 요청을 처리하는데 필요한 권한이 존재하지 않는 경우의 응답입니다. (Mozzi code : 11, Http Status 401)
     */
    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleUnAuthorizedException(UnAuthorizedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new UnAuthorizedException.UnAuthorizedResponse(exception.getMessage()));
    }

    /**
     * 요청된 Session Id에 해당 되는 Openvidu Session이 존재하지 않을 때 발생되는 예외입니다. (Mozzi code : 12, Http Status 400)
     */
    @ExceptionHandler(InvalidSessionIdException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleInvalidSessionIdException(
        InvalidSessionIdException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new InvalidSessionIdException.InvalidSessionIdResponse(exception.getMessage()));
    }

    /**
     * 필요한 데이터가 전부 없을 때 발생하는 예외입니다. (Mozzi code : 13, Http Status 400)
     */
    @ExceptionHandler(NoDataException.class)
    public ResponseEntity<? extends BaseErrorResponse> handleNoDataException(NoDataException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new NoDataException.NoDataResponse(exception.getMessage()));
    }
}
