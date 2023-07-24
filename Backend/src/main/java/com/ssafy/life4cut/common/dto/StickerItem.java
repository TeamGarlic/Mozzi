package com.ssafy.life4cut.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sticker 응답을 위한 DTD Object
 * @see com.ssafy.life4cut.db.entity.remote.Sticker
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StickerItem {
    private long id;
    private String url;
}
