package com.ssafy.mozzi.api.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TemporalFileGetReq {
    private String shareCode;
    private String shareSecret;
    private String fileName;
}
