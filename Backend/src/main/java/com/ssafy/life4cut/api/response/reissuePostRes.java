package com.ssafy.life4cut.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 토큰 재발급 응답 Object
 * @see com.ssafy.life4cut.common.auth.JwtTokenProvider
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class reissuePostRes {
    private String accessToken;
    private String refreshToken;
}
