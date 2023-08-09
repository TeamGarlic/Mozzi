package com.ssafy.mozzi.api.service;

import org.springframework.core.io.Resource;

import com.ssafy.mozzi.api.request.ConnectionPostReq;
import com.ssafy.mozzi.api.request.SessionPostReq;
import com.ssafy.mozzi.api.response.ConnectionPostRes;
import com.ssafy.mozzi.api.response.SessionRes;
import com.ssafy.mozzi.api.response.TemporalFileSavePostRes;

/**
 * Openvidu 부스 관리 Service 입니다.
 */
public interface BoothService {
    SessionRes createBooth(SessionPostReq request, String accessToken) throws Exception;

    SessionRes joinBooth(String shareCode);

    ConnectionPostRes getConnectionToken(ConnectionPostReq request, String accessToken) throws
        Exception;

    SessionRes deleteBooth(String sessionId) throws Exception;

    TemporalFileSavePostRes temporalFileSave(String accessToken, String shareCode, String fileName,
        Resource file);

    Resource getTemporalFile(String shareCode, String shareSecret, String fileName);

    boolean close(String accessToken, String shareCode);
}
