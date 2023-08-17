package com.ssafy.mozzi.api.response;

import com.ssafy.mozzi.common.dto.MozzirollItem;
import com.ssafy.mozzi.common.dto.UserItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *  유저 모찌롤 상세 페이지 응답
 * @see com.ssafy.mozzi.api.service.MozzirollService
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMozzirollDetailGetRes {
    private long id;
    private String title;
    private boolean posted;
    private UserItem user;
    private MozzirollItem mozzirollInfo;

    private boolean isLiked = false;
    private int likeCount;
}
