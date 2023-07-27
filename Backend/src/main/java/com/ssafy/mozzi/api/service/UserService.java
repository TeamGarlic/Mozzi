package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.request.UserLoginPostReq;
import com.ssafy.mozzi.api.request.UserRegisterPostReq;
import com.ssafy.mozzi.api.request.reissuePostReq;
import com.ssafy.mozzi.api.response.UserIdCheckRes;
import com.ssafy.mozzi.api.response.UserLoginPostRes;
import com.ssafy.mozzi.api.response.UserRegisterPostRes;
import com.ssafy.mozzi.api.response.reissuePostRes;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

/**
 *  User 요청에 대한 Service/비즈니스 로직 인터페이스
 *
 * @see UserServiceImpl
 */
public interface UserService {
    UserRegisterPostRes register(UserRegisterPostReq userRegisterInfo);

    UserLoginPostRes login(UserLoginPostReq userLoginInfo);

    reissuePostRes reissue(reissuePostReq reissueInfo);

    BaseResponseBody<UserIdCheckRes> userIdCheck(String userId);
}
