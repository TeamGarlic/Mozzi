package com.ssafy.mozzi.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * 유저 정보를 반환
 * @see com.ssafy.mozzi.api.service.UserService
 */
@AllArgsConstructor
@Data
@Builder
public class UserInfoRes {
    long Id;
    String userId;
    String userNickName;
    String email;
}
