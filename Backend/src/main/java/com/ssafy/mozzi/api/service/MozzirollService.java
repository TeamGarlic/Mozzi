package com.ssafy.mozzi.api.service;

import org.springframework.http.ResponseEntity;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

public interface MozzirollService {
    ResponseEntity<BaseResponseBody<Long>> link(MozziLinkPostRequest request, String accessToken);
}
