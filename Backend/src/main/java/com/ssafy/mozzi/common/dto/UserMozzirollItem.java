package com.ssafy.mozzi.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * UserMozziroll 응답 위한 DTD Object
 * @see com.ssafy.mozzi.db.entity.remote.UserMozziroll
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMozzirollItem {
    private long id;
    private String title;
    private boolean posted;
    private UserItem user;
    private MozzirollItem mozzirollInfo;

    private boolean isLiked = false;
    private int likeCount;
}
