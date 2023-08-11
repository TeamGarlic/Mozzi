package com.ssafy.mozzi.common.dto;

import java.time.LocalDateTime;

/**
 *  userMozziroll , 좋아요 순으로 입력을 받이 Select 할 때 사용하는 DTO
 *
 * @see PopularUserMozzirollItem
 */
public interface PopularUserMozzirollEntityDto {
    Long getId();

    String getObjectName();

    String getTitle();

    LocalDateTime getCreatedAt();

    int getWidth();

    int getHeight();

    int getLikeCount();

    boolean getIsLiked();
}
