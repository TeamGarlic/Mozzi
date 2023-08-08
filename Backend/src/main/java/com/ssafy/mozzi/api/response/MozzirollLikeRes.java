package com.ssafy.mozzi.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 모찌롤 좋아요 응답 Object
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MozzirollLikeRes {
    private int likeCount;
    private boolean isLiked;
}
