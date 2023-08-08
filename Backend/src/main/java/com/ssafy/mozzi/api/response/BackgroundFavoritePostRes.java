package com.ssafy.mozzi.api.response;

import jakarta.validation.constraints.NotNull;
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
    long backgroundId;
    @NotNull
    Boolean isFavorite;
}
