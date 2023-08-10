package com.ssafy.mozzi.api.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TemporalFilePostReq {
    String shareCode;
    String fileName;
    String file;
}
