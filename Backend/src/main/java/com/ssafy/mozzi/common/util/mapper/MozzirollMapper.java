package com.ssafy.mozzi.common.util.mapper;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.common.dto.MozzirollItem;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;

/**
 *  Mozzirollrhk Request/Response Data Object를 연결해주는 Mapper
 */
public class MozzirollMapper {
    /**
     * UserMozziroll 엔티티 를 MozzirollItem 로 변환
     * @param usermozziroll UserMozziroll
     * @return MozzirollItem
     */
    public static MozzirollItem toMozzirollItem(UserMozziroll usermozziroll) {
        return MozzirollItem.builder()
            .creator(UserMapper.toUserItem(usermozziroll.getUser()))
            .createdAt(usermozziroll.getMozziroll().getCreatedAt())
            .objectName(usermozziroll.getMozziroll().getObjectName())
            .build();
    }

    /**
     * UserMozziroll 엔티티 집합을를 MozzirollItem 집합으로 변환
     * @param usermozzirolls List UserMozziroll
     * @return List MozzirollItem
     */
    public static List<MozzirollItem> toMozzirollItems(List<UserMozziroll> usermozzirolls) {
        List<MozzirollItem> mozzirollItems = new ArrayList<>();
        for (UserMozziroll usermozziroll : usermozzirolls) {
            mozzirollItems.add(toMozzirollItem(usermozziroll));
        }
        return mozzirollItems;
    }

    /**
     * UserMozziroll 엔티티 집합을를 UserMozzirollGetRes 로 변환
     * @param mozzirollItems List UserMozziroll
     * @param pages int
     * @return UserMozzirollGetRes
     */
    public static UserMozzirollGetRes toUserMozzirollGetRes(List<UserMozziroll> mozzirollItems, int pages) {
        return UserMozzirollGetRes.builder()
            .mozzirollItems(toMozzirollItems(mozzirollItems))
            .pages(pages)
            .build();
    }
}
