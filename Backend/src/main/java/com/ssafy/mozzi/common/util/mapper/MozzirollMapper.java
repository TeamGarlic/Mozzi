package com.ssafy.mozzi.common.util.mapper;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.mozzi.api.response.MozzirollLikeRes;
import com.ssafy.mozzi.api.response.PopularUserMozzirolGetlRes;
import com.ssafy.mozzi.api.response.PostUserMozzirollPostRes;
import com.ssafy.mozzi.api.response.UserMozzirollDeleteRes;
import com.ssafy.mozzi.common.dto.MozzirollItem;
import com.ssafy.mozzi.common.dto.PopularUserMozzirollEntityDto;
import com.ssafy.mozzi.common.dto.PopularUserMozzirollItem;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;

/**
 *  Mozzirollrhk Request/Response Data Object를 연결해주는 Mapper
 */
public class MozzirollMapper {
    /**
     * Mozziroll 엔티티 를 MozzirollItem 로 변환
     * @param mozziroll Mozziroll
     * @return MozzirollItem
     */
    public static MozzirollItem toMozzirollItem(Mozziroll mozziroll) {
        return MozzirollItem.builder()
            .id(mozziroll.getId())
            .objectName(mozziroll.getObjectName())
            .width(mozziroll.getWidth())
            .height(mozziroll.getHeight())
            .createdAt(mozziroll.getCreatedAt())
            .build();
    }

    /**
     * mozzirollLike 의 정보를 MozzirollLikeRes 로 변환
     * @param likeCount 좋아요 개수
     * @param isLiked 좋아요 여부
     * @return MozzirollLikeRes
     */
    public static MozzirollLikeRes toMozzirollLikeRes(int likeCount, boolean isLiked) {
        return MozzirollLikeRes.builder()
            .likeCount(likeCount)
            .isLiked(isLiked)
            .build();
    }

    /**
     * PopularUserMozzirollEntityDto 의 정보를 PopularUserMozzirollRes 로 변환
     * @param userMozzirolls PopularUserMozzirollEntityDto
     * @param pages int
     * @return PopularUserMozzirollRes
     */
    public static PopularUserMozzirolGetlRes toPopularUserMozzirollGetRes(
        List<PopularUserMozzirollEntityDto> userMozzirolls, int pages) {
        List<PopularUserMozzirollItem> popularUserMozzirollItems = new ArrayList<>();  // 반환 할 List 객체

        for (PopularUserMozzirollEntityDto userMozziroll : userMozzirolls) {
            popularUserMozzirollItems.add(PopularUserMozzirollItem.builder()
                .id(userMozziroll.getId())
                .objectName(userMozziroll.getObjectName())
                .title(userMozziroll.getTitle())
                .isLiked(userMozziroll.getIsLiked())
                .likeCount(userMozziroll.getLikeCount())
                .createdAt(userMozziroll.getCreatedAt())
                .height(userMozziroll.getHeight())
                .width(userMozziroll.getWidth())
                .build());
        }

        return PopularUserMozzirolGetlRes.builder()
            .popularUserMozzirolls(popularUserMozzirollItems)
            .pages(pages)
            .build();
    }

    /**
     * userMozziroll 의 정보를 PopularUserMozzirollRes 로 변환
     * @param userMozziroll UserMozziroll
     * @return UserMozzirollDeleteRes
     */
    public static UserMozzirollDeleteRes toUserMozzirollDeleteRes(UserMozziroll userMozziroll) {
        return UserMozzirollDeleteRes.builder()
            .deleted(true)
            .id(userMozziroll.getId())
            .title(userMozziroll.getTitle())
            .build();
    }

    /**
     * UserMozziroll Entity 의 정보를 PostUserMozzirollPostRes 로 변환
     * @param userMozziroll UserMozziroll Entity
     * @return PostUserMozzirollPostRes
     */
    public static PostUserMozzirollPostRes toPostUserMozzirollPostRes(UserMozziroll userMozziroll) {
        return PostUserMozzirollPostRes.builder()
            .userMozzirollId(userMozziroll.getId())
            .post(userMozziroll.getPosted())
            .build();
    }
}
