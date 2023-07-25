package com.ssafy.life4cut.api.request;

import lombok.Data;

/**
 * 토큰 재발급 요청 Object
 * @see com.ssafy.life4cut.common.auth.JwtTokenProvider
 */
@Data
public class reissuePostReq {
    private String accessToken;
    private String refreshToken;
}
