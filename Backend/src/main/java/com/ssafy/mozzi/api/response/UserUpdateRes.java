package com.ssafy.mozzi.api.response;

import lombok.Builder;
import lombok.Data;

/**
 * 유저 정보 업데이트 응답 Dto 입니다.
 */
@Data
@Builder
public class UserUpdateRes {
    long id;
}
