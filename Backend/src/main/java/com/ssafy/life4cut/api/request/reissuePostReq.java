package com.ssafy.life4cut.api.request;

import lombok.Data;

@Data
public class reissuePostReq {
    private String accessToken;
    private String refreshToken;
}
