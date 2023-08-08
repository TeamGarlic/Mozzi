package com.ssafy.mozzi.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Favorite Background 연결 반환 Dto 입니다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackgroundFavoritePostRes {
    Long backgroundId;
    Boolean isFavorite;
}
