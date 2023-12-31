package com.ssafy.mozzi.api.response;

import lombok.Builder;
import lombok.Data;

/**
 * Session 관련 요청에 대한 응답 클래스입니다.
 */
@Data
@Builder
public class SessionRes {
    private String shareCode;
    private String sessionId;
    private String shareSecret;
}
