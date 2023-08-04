package com.ssafy.mozzi.common.util.mapper;

import java.util.ArrayList;
import java.util.List;

import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.common.dto.MozzirollItem;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;

/**
 *  Mozzirollrhk Request/Response Data Object를 연결해주는 Mapper
 *
 * @see com.ssafy.mozzi.db.entity.remote.Mozziroll
 * @see UserMozziroll
 * @see MozzirollItem
 * @see UserMozzirollGetRes
 */
public class MozzirollMapper {
    public static MozzirollItem toMozzirollItem(UserMozziroll usermozziroll) {
        return MozzirollItem.builder()
            .creator(UserMapper.toUserItem(usermozziroll.getUser()))
            .createdAt(usermozziroll.getMozziroll().getCreatedAt())
            .objectName(usermozziroll.getMozziroll().getObjectName())
            .build();
    }

    public static List<MozzirollItem> toMozzirollItems(List<UserMozziroll> usermozzirolls) {
        List<MozzirollItem> mozzirollItems = new ArrayList<>();
        for (UserMozziroll usermozziroll : usermozzirolls) {
            mozzirollItems.add(toMozzirollItem(usermozziroll));
        }
        return mozzirollItems;
    }

    public static UserMozzirollGetRes toUserMozzirollGetRes(List<UserMozziroll> mozzirollItems, int pages) {
        return UserMozzirollGetRes.builder()
            .mozzirollItems(toMozzirollItems(mozzirollItems))
            .pages(pages)
            .build();
    }
}
