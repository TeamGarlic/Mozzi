package com.ssafy.mozzi.api.request;

import lombok.Data;

/**
 *  회원 가입 요청 data Object
 *
 * @see com.ssafy.mozzi.common.util.mapper.UserMapper
 */
@Data
public class UserRegisterPostReq {
    private String userId;
    private String nickname;
    private String email;
    private String password;
}
