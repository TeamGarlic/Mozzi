package com.ssafy.mozzi.common.exception;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ErrorResponse {

    private MozziAPIErrorCode code;

    private String message;
}
