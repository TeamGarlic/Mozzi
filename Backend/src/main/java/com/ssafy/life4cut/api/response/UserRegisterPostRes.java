package com.ssafy.life4cut.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *  회원 가입 응답 data Object
 *
 * @see com.ssafy.life4cut.common.util.mapper.UserMapper
 * @see com.ssafy.life4cut.api.service.UserServiceImpl
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterPostRes {
    private Long id;
}
