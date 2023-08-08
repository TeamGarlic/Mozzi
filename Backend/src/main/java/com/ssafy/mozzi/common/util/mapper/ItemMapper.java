package com.ssafy.mozzi.common.util.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.ssafy.mozzi.api.response.BackgroundFavoritePostRes;
import com.ssafy.mozzi.api.response.FrameListGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundPostRes;
import com.ssafy.mozzi.api.response.ItemStickerGetRes;
import com.ssafy.mozzi.common.dto.BackgroundItem;
import com.ssafy.mozzi.common.dto.FrameClipItem;
import com.ssafy.mozzi.common.dto.FrameItem;
import com.ssafy.mozzi.common.dto.StickerItem;
import com.ssafy.mozzi.db.entity.remote.Backgroud;
import com.ssafy.mozzi.db.entity.remote.BackgroundEntityDto;
import com.ssafy.mozzi.db.entity.remote.BackgroundFavorite;
import com.ssafy.mozzi.db.entity.remote.Frame;
import com.ssafy.mozzi.db.entity.remote.FrameClip;
import com.ssafy.mozzi.db.entity.remote.Sticker;

/**
 * Item 과 Request/Response Data Object를 연결해주는 Mapper
 */
public class ItemMapper {

    /**
     * 백그라운드 응답을 위해 BackgroundEntityDto 의 집합을 BackgroundItem 집합으로 변환
     * @param backgrounds List BackgroundEntityDto
     * @return List BackgroundItem
     * @see Backgroud
     * @see BackgroundItem
     */

    public static ItemBackgroundGetRes toItemBackgroundGetRes(List<BackgroundEntityDto> backgrounds, int pages) {
        List<BackgroundItem> backgroundItems = new ArrayList<>();  // 반환 할 List 객체

        for (BackgroundEntityDto backgroud : backgrounds) {
            backgroundItems.add(BackgroundItem.builder()
                .id(backgroud.getId())
                .objectName(backgroud.getObjectName())
                .title(backgroud.getTitle())
                .isFavorite(backgroud.getFavoriteId() == null ? false : true)
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
                .objectName(sticker.getObjectName())
                .title(sticker.getTitle())
                .build());
        }

        return ItemStickerGetRes.builder()
            .stickers(stickerItems)
            .pages(pages)
            .build();
    }

    /**
     *  프레임리스트 응답을 위해 Frame 엔티티의 집합을 FrameItem 엔티티의 집합으로 변환
     *
     * @param frames List<Frame>
     * @return FrameListGetRes
     */
    public static FrameListGetRes toFrameListGetRes(Set<Frame> frames) {
        List<FrameItem> frameList = new ArrayList<>();
        for (Frame frame : frames) {
            frameList.add(FrameItem.builder()
                .id(frame.getId())
                .objectName(frame.getObjectName())
                .title(frame.getTitle())
                .rects(toFrameClipItem(frame.getFrameClips()))
                .build());
        }

        return FrameListGetRes.builder()
            .frames(frameList)
            .build();
    }

    /**
     *  FrameClip 엔티티의 집합을 FrameClipItem 엔티티의 집합으로 변환
     *
     * @param clips Set<FrameClip>
     * @return FrameListGetRes
     */
    public static List<FrameClipItem> toFrameClipItem(Set<FrameClip> clips) {
        List<FrameClipItem> clipList = new ArrayList<>();

        for (FrameClip clip : clips) {
            clipList.add(FrameClipItem.builder()
                .x(clip.getX())
                .y(clip.getY())
                .width(clip.getWidth())
                .height(clip.getHeight())
                .build());
        }

        return clipList;
    }

    /**
     *  Backgroud 엔티티를 ItemBackgroundPostRes로 변환
     *
     * @param backgroud Backgroud
     * @return ItemBackgroundPostRes
     */
    public static ItemBackgroundPostRes toItemBackgroundPostRes(Backgroud backgroud) {
        return ItemBackgroundPostRes.builder()
            .id(backgroud.getId())
            .build();
    }

    /**
     * BackgroundFavorite 객체의 정보를 BackgroundFavoritePostRes 로 변환
     * @param backgroundFavorite BackgroundFavorite
     * @param isFavorite boolean
     * @return BackgroundFavoritePostRes
     */
    public static BackgroundFavoritePostRes toBackgroundFavoritePostRes(BackgroundFavorite backgroundFavorite,
        boolean isFavorite) {
        return BackgroundFavoritePostRes.builder()
            .backgroundId(backgroundFavorite.getBackground().getId())
            .isFavorite(isFavorite)
            .build();
    }
}
