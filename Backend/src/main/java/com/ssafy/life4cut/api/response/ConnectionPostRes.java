package com.ssafy.life4cut.api.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConnectionPostRes {
    private String token;
}
