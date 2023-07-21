package com.ssafy.life4cut.common.util.mapper;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.life4cut.api.response.ItemBackgroundGetRes;
import com.ssafy.life4cut.api.response.ItemStickerGetRes;
import com.ssafy.life4cut.common.dto.BackgroundItem;
import com.ssafy.life4cut.common.dto.StickerItem;
import com.ssafy.life4cut.db.entity.remote.Backgroud;
import com.ssafy.life4cut.db.entity.remote.Sticker;

/**
 * Item 과 Request/Response Data Object를 연결해주는 Mapper
 */
public class ItemMapper {

    /**
     * 백그라운드 응답을 위해 Background 엔티티의 집합을 BackgroundItem 엔티티의 집합으로 변환
     * @param backgrounds List Background
     * @return List BackgroundItem
     * @see Backgroud
     * @see BackgroundItem
     */

    public static ItemBackgroundGetRes toItemBackgroundGetRes(List<Backgroud> backgrounds, int pages) {
        List<BackgroundItem> backgroundItems = new ArrayList<>();  // 반환 할 List 객체

        for (Backgroud backgroud : backgrounds) {
            backgroundItems.add(BackgroundItem.builder()
                .id(backgroud.getId())
                .url(backgroud.getUrl())
                .build());
        }

        return ItemBackgroundGetRes.builder()
            .backgrounds(backgroundItems)
            .pages(pages)
            .build();
    }

    /**
     * 스티커 응답을 위해 Sticker 엔티티의 집합을 StickerEntity 엔티티의 집합으로 변환
     * @param stickers List Sticker
     * @return List StickerItem
     * @see Sticker
     * @see StickerItem
     */
    public static ItemStickerGetRes toItemStickerGetRes(List<Sticker> stickers, int pages) {
        List<StickerItem> stickerItems = new ArrayList<>();  // 반환 할 List 객체

        for (Sticker sticker : stickers) {
            stickerItems.add(StickerItem.builder()
                .id(sticker.getId())
                .url(sticker.getUrl())
                .build());
        }

        return ItemStickerGetRes.builder()
            .stickers(stickerItems)
            .pages(pages)
            .build();
    }
}
