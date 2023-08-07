package com.ssafy.mozzi.common.util.mapper;

import com.ssafy.mozzi.api.response.ConnectionPostRes;
import com.ssafy.mozzi.api.response.SessionRes;

import io.openvidu.java.client.Connection;

/**
 * Booth, Seesion 과 Request/Response Data Object를 연결해주는 Mapper
 */
public class BoothMapper {
    /**
     *  Session 정보를 SessionRes 변환
     *
     * @param sessionId String
     * @param shareCode String
     * @return SessionRes
     */
    public static SessionRes toSessionRes(String sessionId, String shareCode) {
        return SessionRes.builder()
            .shareCode(shareCode)
            .sessionId(sessionId)
            .build();
    }

    /**
     *  Connection Object 를 ConnectionPostRes 변환
     *
     * @param connection Connection
     * @return ConnectionPostRes
     */
    public static ConnectionPostRes toConnectionPostRes(Connection connection) {
        return ConnectionPostRes.builder()
            .token(connection.getToken())
            .build();
    }
}
