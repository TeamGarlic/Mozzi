package com.ssafy.mozzi.db.entity.remote;

import java.time.LocalDateTime;

/**
 *  Background 조회 시, 사용자의 즐겨찾기 여부 데이터를 받이 Select 할 때 사용하는 DTO
 *
 * @see Backgroud
 * @see BackgroundFavorite
 */
public interface BackgroundEntityDto {
    Long getId();

    String getObjectName();

    String getTitle();

    LocalDateTime getCreatedAt();

    Long getFavoriteId();
}
