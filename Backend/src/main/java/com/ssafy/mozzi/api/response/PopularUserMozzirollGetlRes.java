package com.ssafy.mozzi.api.response;

import java.util.List;

import com.ssafy.mozzi.common.dto.UserMozzirollItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 인기 유저모찌롤 리스트 응답 Object
 * @see com.ssafy.mozzi.common.dto.UserMozzirollItem
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PopularUserMozzirollGetlRes {
    private List<UserMozzirollItem> userMozzirollItems;
    private int pages;  // 총 페이지 수
}
