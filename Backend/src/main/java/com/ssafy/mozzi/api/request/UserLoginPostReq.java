package com.ssafy.mozzi.api.request;

import lombok.Data;

/**
 *  로그인 요청 data Object
 *
 * @see com.ssafy.mozzi.common.util.mapper.UserMapper
 */
@Data
public class UserLoginPostReq {
    private String userId;
    private String password;
}
