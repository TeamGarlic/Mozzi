package com.ssafy.mozzi.api.request;

import lombok.Data;

/**
 * 토큰 재발급 요청 Object
 * @see com.ssafy.mozzi.common.auth.JwtTokenProvider
 */
@Data
public class reissuePostReq {
    private String accessToken;
    private String refreshToken;
}
