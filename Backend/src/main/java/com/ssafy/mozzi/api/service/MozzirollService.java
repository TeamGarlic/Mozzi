package com.ssafy.mozzi.api.service;

import org.springframework.http.ResponseEntity;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

/**
 * Moziilroll 관리 서비스입니다.
 */
public interface MozzirollService {
    ResponseEntity<BaseResponseBody<Long>> link(MozziLinkPostRequest request, String accessToken);

    UserMozzirollGetRes getMozzirollsByUser(String accessToken, int pageNum, int pageSize);
}
