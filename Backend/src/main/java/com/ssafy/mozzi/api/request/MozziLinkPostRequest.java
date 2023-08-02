package com.ssafy.mozzi.api.request;

import lombok.Data;

@Data
public class MozziLinkPostRequest {
    private long boothId;
    private long mozzirollId;
    private String title;
}
