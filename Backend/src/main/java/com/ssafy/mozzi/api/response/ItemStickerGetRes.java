package com.ssafy.mozzi.api.response;

import java.util.List;

import com.ssafy.mozzi.common.dto.BackgroundItem;
import com.ssafy.mozzi.common.dto.StickerItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 스티커 응답 Object
 * @see BackgroundItem
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemStickerGetRes {
    private List<StickerItem> stickers;
    private int pages;  // 총 페이지 수
}
