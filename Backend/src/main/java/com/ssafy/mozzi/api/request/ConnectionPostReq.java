package com.ssafy.mozzi.api.request;

import lombok.Data;

/**
 * Openvidu Websocket 연결 요청 Dto 입니다.
 */
@Data
public class ConnectionPostReq {
    private String sessionId;
}
