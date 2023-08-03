package com.ssafy.mozzi.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Mozziroll 업로드 응답 Dto 입니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMozzirollPostRes {
    private Long id; // mozziroll의 id
}
