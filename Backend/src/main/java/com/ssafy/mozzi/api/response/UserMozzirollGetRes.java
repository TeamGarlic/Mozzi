package com.ssafy.mozzi.api.response;

import java.util.List;

import com.ssafy.mozzi.common.dto.BackgroundItem;
import com.ssafy.mozzi.common.dto.MozzirollItem;

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
public class UserMozzirollGetRes {
    private List<MozzirollItem> mozzirollItems;
    private int pages;  // 총 페이지 수
}