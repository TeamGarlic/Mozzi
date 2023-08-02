package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.request.ConnectionPostReq;
import com.ssafy.mozzi.api.request.SessionPostReq;
import com.ssafy.mozzi.api.response.ConnectionPostRes;
import com.ssafy.mozzi.api.response.SessionRes;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

/**
 * Openvidu 부스 관리 Service 입니다.
 */
public interface BoothService {
    BaseResponseBody<SessionRes> createBooth(SessionPostReq request, String accessToken) throws Exception;

    BaseResponseBody<SessionRes> joinBooth(String shareCode);

    BaseResponseBody<ConnectionPostRes> getConnectionToken(ConnectionPostReq request, String accessToken) throws
        Exception;

    BaseResponseBody<SessionRes> deleteBooth(String sessionId) throws Exception;
}
