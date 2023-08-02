package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;
import org.springframework.http.ResponseEntity;

/**
 * Moziilroll 관리 서비스입니다.
 */
public interface MozzirollService {
    ResponseEntity<BaseResponseBody<Long>> link(MozziLinkPostRequest request, String accessToken);
}
