package com.ssafy.life4cut.common.util.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.ssafy.life4cut.api.response.FrameListGetRes;
import com.ssafy.life4cut.api.response.ItemBackgroundGetRes;
import com.ssafy.life4cut.api.response.ItemStickerGetRes;
import com.ssafy.life4cut.common.dto.BackgroundItem;
import com.ssafy.life4cut.common.dto.FrameClipItem;
import com.ssafy.life4cut.common.dto.FrameItem;
import com.ssafy.life4cut.common.dto.StickerItem;
import com.ssafy.life4cut.db.entity.remote.Backgroud;
import com.ssafy.life4cut.db.entity.remote.Frame;
import com.ssafy.life4cut.db.entity.remote.FrameClip;
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
                .url(frame.getUrl())
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
}
