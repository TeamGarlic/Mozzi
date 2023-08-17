package com.ssafy.mozzi.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 유저 모찌롤을 커뮤니티에 등록/해제하는 기능의 반환 Object
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostUserMozzirollPostRes {
    long userMozzirollId;
    boolean post;
}
