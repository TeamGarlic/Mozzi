package com.ssafy.life4cut.common.util.mapper;

import com.ssafy.life4cut.api.request.UserRegisterPostReq;
import com.ssafy.life4cut.api.response.UserRegisterPostRes;
import com.ssafy.life4cut.db.entity.User;

/**
 *  User와 Request/Response Data Object를 연결해주는 Mapper
 *
 * @see User
 * @see UserRegisterPostReq
 * @see UserRegisterPostRes
 */
public class UserMapper {
    public static User toEntity(UserRegisterPostReq request) {
        return User.builder()
            .userId(request.getUserId())
            .password(request.getPassword())
            .nickname(request.getNickname())
            .email(request.getEmail())
            .build();
    }

    public static UserRegisterPostRes toRegistRes(User user) {
        return UserRegisterPostRes.builder()
            .id(user.getId())
            .build();
    }
}
