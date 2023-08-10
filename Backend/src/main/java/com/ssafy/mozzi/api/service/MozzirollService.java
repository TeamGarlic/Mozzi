package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.api.request.PostUserMozzirollPostReq;
import com.ssafy.mozzi.api.response.MozzirollLikeRes;
import com.ssafy.mozzi.api.response.PopularUserMozzirolGetlRes;
import com.ssafy.mozzi.api.response.PostUserMozzirollPostRes;
import com.ssafy.mozzi.api.response.UserMozzirollGetRes;

/**
 * Moziilroll 관리 서비스입니다.
 */
public interface MozzirollService {
    Long link(MozziLinkPostRequest request, String accessToken);

    UserMozzirollGetRes getMozzirollsByUser(String accessToken, int pageNum, int pageSize);

    MozzirollLikeRes likeMozziroll(String accessToken, long userMozzirollId);

    PopularUserMozzirolGetlRes getPopularUserMozzirolls(String accessToken, int pageNum, int pageSize);

    PostUserMozzirollPostRes postUserMozziroll(String accessToken, PostUserMozzirollPostReq postUserMozzirollPostReq);
}
