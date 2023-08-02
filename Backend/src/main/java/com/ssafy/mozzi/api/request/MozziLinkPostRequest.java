package com.ssafy.mozzi.api.request;

import lombok.Data;

/**
 * Mozzilroll 연결 요청 Dto 입니다.
 */
@Data
public class MozziLinkPostRequest {
    private long boothId;
    private long mozzirollId;
    private String title;
}
