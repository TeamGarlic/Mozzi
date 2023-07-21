package com.ssafy.life4cut.api.response;

import lombok.Builder;
import lombok.Data;

/**
 * Session 관련 요청에 대한 응답 클래스입니다.
 */
@Data
@Builder
public class SessionRes {
    String shareCode;
    String sessionId;
}
