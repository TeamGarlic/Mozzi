package com.ssafy.life4cut.common.util.mapper;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.life4cut.common.dto.BackgroundItem;
import com.ssafy.life4cut.db.entity.Backgroud;

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
    public static List<BackgroundItem> toBackgrounds(List<Backgroud> request) {
        List<BackgroundItem> backgrounds = new ArrayList<>();  // 반환 할 List 객체

        for (Backgroud backgroud : request) {
            backgrounds.add(BackgroundItem.builder()
                .id(backgroud.getId())
                .url(backgroud.getUrl())
                .build());
        }

        return backgrounds;
    }
}
