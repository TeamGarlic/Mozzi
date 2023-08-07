package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.request.ReIssuePostReq;
import com.ssafy.mozzi.api.request.UserLoginPostReq;
import com.ssafy.mozzi.api.request.UserRegisterPostReq;
import com.ssafy.mozzi.api.request.UserUpdatePutReq;
import com.ssafy.mozzi.api.response.ReIssuePostRes;
import com.ssafy.mozzi.api.response.UserIdCheckRes;
import com.ssafy.mozzi.api.response.UserInfoRes;
import com.ssafy.mozzi.api.response.UserLoginPostRes;
import com.ssafy.mozzi.api.response.UserPasswordResetPostRes;
import com.ssafy.mozzi.api.response.UserRegisterPostRes;
import com.ssafy.mozzi.api.response.UserUpdateRes;
import com.ssafy.mozzi.db.entity.remote.User;

/**
 *  User 요청에 대한 Service/비즈니스 로직 인터페이스
 *
 * @see UserServiceImpl
 */
public interface UserService {
    UserRegisterPostRes register(UserRegisterPostReq userRegisterInfo);

    UserLoginPostRes login(UserLoginPostReq userLoginInfo);

    ReIssuePostRes reissue(ReIssuePostReq reissueInfo);

    UserIdCheckRes userIdCheck(String userId);

    UserInfoRes getUserInfo(String accessToken);

    void logout(String accessToken);

    User findUserByToken(String accessToken);

    UserUpdateRes update(UserUpdatePutReq request);

    UserPasswordResetPostRes reset(String userId);
}
