package com.ssafy.mozzi.api.request;

import lombok.Data;

/**
 * booth 생성에 관한 데이터를 담은 클래스입니다.
 */
@Data
public class SessionPostReq {
    private String shareCode;
}
