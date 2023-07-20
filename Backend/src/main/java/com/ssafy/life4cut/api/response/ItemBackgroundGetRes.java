package com.ssafy.life4cut.api.response;

import java.util.List;

import com.ssafy.life4cut.common.dto.BackgroundItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 가상 배경 리스트 응답 Object
 * @see BackgroundItem
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemBackgroundGetRes {
    private List<BackgroundItem> backgrounds;
    private int pages;  // 총 페이지 수
}
