package com.ssafy.mozzi.common.util.mapper;

import com.ssafy.mozzi.api.response.ConnectionPostRes;
import com.ssafy.mozzi.api.response.SessionRes;

import io.openvidu.java.client.Connection;

public class BoothMapper {
    public static SessionRes toSessionRes(String sessionId, String shareCode) {
        return SessionRes.builder()
            .shareCode(shareCode)
            .sessionId(sessionId)
            .build();
    }

    public static ConnectionPostRes toConnectionPostRes(Connection connection) {
        return ConnectionPostRes.builder()
            .token(connection.getToken())
            .build();
    }
}
