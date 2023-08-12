package com.ssafy.mozzi.common.util.mapper;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.common.dto.UserMozzirollItem;
import com.ssafy.mozzi.common.dto.UserMozzirollItemDto;

/**
 *  Mozzirollrhk Request/Response Data Object를 연결해주는 Mapper
 */
public class UserMozzirollMapper {
    /**
     * UserMozziroll 엔티티 를 MozzirollItem 로 변환
     * @param usermozzirollItemDto UserMozziroll
     * @return MozzirollItem
     */
    public static UserMozzirollItem toUserMozzirollItem(UserMozzirollItemDto usermozzirollItemDto) {
        return UserMozzirollItem.builder()
            .id(usermozzirollItemDto.getId())
            .title(usermozzirollItemDto.getTitle())
            .posted(usermozzirollItemDto.getPosted())
            .user(UserMapper.toUserItem(usermozzirollItemDto.getUser()))
            .mozzirollInfo(MozzirollMapper.toMozzirollItem(usermozzirollItemDto.getMozziroll()))
            .isLiked(usermozzirollItemDto.getIsLiked())
            .likeCount(usermozzirollItemDto.getLikeCount())
            .build();
    }

    /**
     * UserMozziroll 엔티티 집합을를 MozzirollItem 집합으로 변환
     * @param usermozzirollItemDtos List UserMozziroll
     * @return List MozzirollItem
     */
    public static List<UserMozzirollItem> toUserMozzirollItems(List<UserMozzirollItemDto> usermozzirollItemDtos) {
        List<UserMozzirollItem> userMozzirollItems = new ArrayList<>();
        for (UserMozzirollItemDto usermozzirollItemDto : usermozzirollItemDtos) {
            userMozzirollItems.add(toUserMozzirollItem(usermozzirollItemDto));
        }
        return userMozzirollItems;
    }

    /**
     * UserMozzirollItemDto 엔티티 집합을를 UserMozzirollGetRes 로 변환
     * @param userMozzirollItemDtos List UserMozzirollItemDto
     * @param pages int
     * @return UserMozzirollGetRes
     */
    public static UserMozzirollGetRes toUserMozzirollGetRes(List<UserMozzirollItemDto> userMozzirollItemDtos,
        int pages) {
        return UserMozzirollGetRes.builder()
            .userMozzirollItems(toUserMozzirollItems(userMozzirollItemDtos))
            .pages(pages)
            .build();
    }
}
