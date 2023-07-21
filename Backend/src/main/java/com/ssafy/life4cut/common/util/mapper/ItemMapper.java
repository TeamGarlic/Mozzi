package com.ssafy.life4cut.common.util.mapper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.ssafy.life4cut.api.response.FrameListGetRes;
import com.ssafy.life4cut.api.response.ItemBackgroundGetRes;
import com.ssafy.life4cut.common.dto.BackgroundItem;
import com.ssafy.life4cut.common.dto.FrameClipItem;
import com.ssafy.life4cut.common.dto.FrameItem;
import com.ssafy.life4cut.db.entity.remote.Backgroud;
import com.ssafy.life4cut.db.entity.remote.Frame;
import com.ssafy.life4cut.db.entity.remote.FrameClip;

/**
 * Item 과 Request/Response Data Object를 연결해주는 Mapper
 */
public class ItemMapper {

    /**
     * 백그라운드 응답을 위해 Background 엔티티의 집합을 BackgroundItem 엔티티의 집합으로 변환
     * @param request List Background
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
     *  프레임리스트 응답을 위해 Frame 엔티티의 집합을 FrameItem 엔티티의 집합으로 변환
     *
     * @param frames List<Frame>
     * @return FrameListGetRes
     */
    public static FrameListGetRes toFrameListGetRes(List<Frame> frames) {
        Set<FrameItem> frameList = new HashSet<>();
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
    public static Set<FrameClipItem> toFrameClipItem(Set<FrameClip> clips) {
        Set<FrameClipItem> clipList = new HashSet<>();

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
