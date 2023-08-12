package com.ssafy.mozzi.common.dto;

import com.ssafy.mozzi.db.entity.remote.Mozziroll;
import com.ssafy.mozzi.db.entity.remote.User;

/**
 *  userMozziroll + userMozziroll Like 결과를 받는 DTO
 *
 * @see com.ssafy.mozzi.db.entity.remote.UserMozziroll
 * @see com.ssafy.mozzi.db.entity.remote.MozzirollLike
 * @see UserMozzirollItem
 */
public interface UserMozzirollItemDto {
    Long getId();

    String getTitle();

    Boolean getPosted();

    User getUser();

    Mozziroll getMozziroll();

    int getLikeCount();

    boolean getIsLiked();
}
