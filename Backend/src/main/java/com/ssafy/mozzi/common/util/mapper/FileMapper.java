package com.ssafy.mozzi.common.util.mapper;

import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;

public class FileMapper {
    public static FileMozzirollPostRes toFileMozzirollPostRes(Mozziroll mozziroll) {
        return FileMozzirollPostRes.builder()
            .id(mozziroll.getId())
            .build();
    }
}
