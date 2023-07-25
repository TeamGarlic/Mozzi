package com.ssafy.life4cut.api.service;

import com.ssafy.life4cut.api.request.UserLoginPostReq;
import com.ssafy.life4cut.api.request.UserRegisterPostReq;
import com.ssafy.life4cut.api.request.reissuePostReq;
import com.ssafy.life4cut.api.response.UserLoginPostRes;
import com.ssafy.life4cut.api.response.UserRegisterPostRes;
import com.ssafy.life4cut.api.response.reissuePostRes;

/**
 *  User 요청에 대한 Service/비즈니스 로직 인터페이스
 *
 * @see UserServiceImpl
 */
public interface UserService {
    UserRegisterPostRes register(UserRegisterPostReq userRegisterInfo);

    UserLoginPostRes login(UserLoginPostReq userLoginInfo);

    reissuePostRes reissue(reissuePostReq reissueInfo);
}
