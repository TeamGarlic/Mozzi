package com.ssafy.mozzi.api.response;

import java.util.List;

import com.ssafy.mozzi.common.dto.UserMozzirollItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 유저 모찌롤 리스트 응답 Object
 * @see UserMozzirollItem
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMozzirollGetRes {
    private List<UserMozzirollItem> userMozzirollItems;
    private int pages;  // 총 페이지 수
}