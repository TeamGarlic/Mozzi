package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;

/**
 * Moziilroll 관리 서비스입니다.
 */
public interface MozzirollService {
    Long link(MozziLinkPostRequest request, String accessToken);
}
