package com.ssafy.mozzi.common.util.mapper;

import com.ssafy.mozzi.api.request.UserRegisterPostReq;
import com.ssafy.mozzi.api.response.ReIssuePostRes;
import com.ssafy.mozzi.api.response.UserInfoRes;
import com.ssafy.mozzi.api.response.UserLoginPostRes;
import com.ssafy.mozzi.api.response.UserRegisterPostRes;
import com.ssafy.mozzi.api.response.UserUpdateRes;
import com.ssafy.mozzi.common.auth.CustomUserDetails;
import com.ssafy.mozzi.common.dto.UserItem;
import com.ssafy.mozzi.db.entity.remote.User;

/**
 *  User와 Request/Response Data Object를 연결해주는 Mapper
 */
public class UserMapper {
    /**
     * UserRegisterPostReq Object 를 User 엔티티 로 변환
     * @param request UserRegisterPostReq
     * @return User
     */
    public static User toEntity(UserRegisterPostReq request) {
        return User.builder()
            .userId(request.getUserId())
            .password(request.getPassword())
            .nickname(request.getNickname())
            .email(request.getEmail())
            .build();
    }

    /**
     * User 엔티티 를 UserRegisterPostRes 로 변환
     * @param user User
     * @return UserRegisterPostRes
     */
    public static UserRegisterPostRes toRegistRes(User user) {
        return UserRegisterPostRes.builder()
            .id(user.getId())
            .build();
    }

    /**
     * User 엔티티 를 UserLoginPostRes 로 변환
     * @param user User
     * @param accessToken String
     * @param refreshToken String
     * @return UserLoginPostRes
     */
    public static UserLoginPostRes toLoginRes(User user, String accessToken, String refreshToken) {
        return UserLoginPostRes.builder()
            .id(user.getId())
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }

    /**
     * 토큰으로 ReIssuePostRes 로 변환
     * @param accessToken String
     * @param refreshToken String
     * @return ReIssuePostRes
     */
    public static ReIssuePostRes toReissueRes(String accessToken, String refreshToken) {
        return ReIssuePostRes.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .build();
    }

    /**
     * User 엔티티 를 CustomUserDetails 로 변환
     * @param user User
     * @return CustomUserDetails
     */
    public static CustomUserDetails toCustomUserDetails(User user) {
        return new CustomUserDetails().builder()
            .id(user.getId().toString())
            .userId(user.getUserId())
            .password(user.getPassword())
            .email(user.getEmail())
            .build();
    }

    /**
     * User 엔티티 를 UserInfoRes 로 변환
     * @param user User
     * @return UserInfoRes
     */
    public static UserInfoRes toUserInfoRes(User user) {
        return UserInfoRes.builder()
            .id(user.getId())
            .userId(user.getUserId())
            .userNickname(user.getNickname())
            .email(user.getEmail())
            .build();
    }

    /**
     * User 엔티티 를 UserUpdateRes 로 변환
     * @param user User
     * @return UserUpdateRes
     */
    public static UserUpdateRes toUserUpdateRes(User user) {
        return UserUpdateRes.builder().id(user.getId()).build();
    }

    /**
     * User 엔티티 를 UserItem 로 변환
     * @param user User
     * @return UserItem
     */
    public static UserItem toUserItem(User user) {
        return UserItem.builder()
            .id(user.getId())
            .userId(user.getUserId())
            .nickname(user.getNickname())
            .build();
    }
}
