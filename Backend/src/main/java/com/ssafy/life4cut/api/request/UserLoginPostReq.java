package com.ssafy.life4cut.api.request;

import lombok.Data;

/**
 *  로그인 요청 data Object
 *
 * @see com.ssafy.life4cut.common.util.mapper.UserMapper
 */
@Data
public class UserLoginPostReq {
    private String id;
    private String password;
}
