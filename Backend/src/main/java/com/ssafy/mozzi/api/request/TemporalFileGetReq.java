package com.ssafy.mozzi.api.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TemporalFileGetReq {
    String shareCode;
    String shareSecret;
    String fileName;
}
