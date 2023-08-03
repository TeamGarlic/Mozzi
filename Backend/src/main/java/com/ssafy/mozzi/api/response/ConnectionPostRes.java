package com.ssafy.mozzi.api.response;

import lombok.Builder;
import lombok.Data;

/**
 * Openvidu Websocket 응답 Dto 입니다.
 */
@Data
@Builder
public class ConnectionPostRes {
    private String token;
}
