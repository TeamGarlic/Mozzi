package com.ssafy.mozzi.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 유저 모찌롤을 커뮤니티에 등록/해제하는 기능의 요청 Object
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostUserMozzirollPostReq {
    long userMozzirollId;
}
