package com.ssafy.mozzi.api.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TemporalFileSavePostRes {
    String shareCode;
    String fileName;
}
