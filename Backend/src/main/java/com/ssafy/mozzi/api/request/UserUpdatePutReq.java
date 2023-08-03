package com.ssafy.mozzi.api.request;

import lombok.Data;

/**
 * 유저 정보 갱신 요청 Dto 입니다.
 */
@Data
public class UserUpdatePutReq {
    private String accessToken;
    private String password;
    private String nickname;
    private String email;
}
