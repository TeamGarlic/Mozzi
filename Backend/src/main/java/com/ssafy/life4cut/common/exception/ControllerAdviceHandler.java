package com.ssafy.life4cut.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.life4cut.common.exception.handler.UserIdNotExistsException;
import com.ssafy.life4cut.common.model.response.BaseResponseBody;

/**
 * REST Controller에서 발생되는 Exception을 처리하기 위한 Controller Advice 입니다.
 */
@RestControllerAdvice
public class ControllerAdviceHandler {
    // TODO: General 한 exception 추가
    // TODO: exception/handler에 정의된 Exception 마다 처리

    /**
     * 이미 존재하는 Id일 경우의 응답을 반환한다.
     * @return 이미 아이디에 해당하는 유저가 존재할 경우
     * @see UserIdNotExistsException
     * @see com.ssafy.life4cut.api.service.UserService
     */
    @ExceptionHandler(UserIdNotExistsException.class)
    public ResponseEntity<BaseResponseBody> handleDuplicateUserIdException(UserIdNotExistsException ex) {
        return new ResponseEntity<>(
            BaseResponseBody.builder()
                .message("User ID not exists.")
                .build(), HttpStatus.NOT_FOUND);
    }
}
