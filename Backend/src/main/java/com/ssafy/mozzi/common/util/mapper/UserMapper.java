package com.ssafy.mozzi.common.util.mapper;

import com.ssafy.mozzi.api.request.UserRegisterPostReq;
import com.ssafy.mozzi.api.response.ReIssuePostRes;
import com.ssafy.mozzi.api.response.UserInfoRes;
import com.ssafy.mozzi.api.response.UserLoginPostRes;
import com.ssafy.mozzi.api.response.UserRegisterPostRes;
import com.ssafy.mozzi.common.auth.CustomUserDetails;
import com.ssafy.mozzi.db.entity.remote.User;

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

    public static UserLoginPostRes toLoginRes(User user, String accessToken, String refreshToken) {
        return UserLoginPostRes.builder()
            .id(user.getId())
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }

    public static ReIssuePostRes toReissueRes(String accessToken, String refreshToken) {
        return ReIssuePostRes.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }

    public static CustomUserDetails toCustomUserDetails(User user) {
        return new CustomUserDetails().builder()
            .id(user.getId().toString())
            .userId(user.getUserId())
            .password(user.getPassword())
            .email(user.getEmail())
            .build();
    }

    public static UserInfoRes toUserInfoRes(User user) {
        return UserInfoRes.builder()
            .id(user.getId())
            .userId(user.getUserId())
            .userNickname(user.getNickname())
            .email(user.getEmail())
            .build();
    }
}
