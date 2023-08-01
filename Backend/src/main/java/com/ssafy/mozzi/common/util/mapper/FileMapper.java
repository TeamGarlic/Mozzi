package com.ssafy.mozzi.common.util.mapper;

import com.ssafy.mozzi.api.response.FileMozziRollPostRes;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;

public class FileMapper {
    public static FileMozziRollPostRes toFileMozziRollPostRes(Mozziroll mozziroll) {
        return FileMozziRollPostRes.builder()
            .id(mozziroll.getId())
            .build();
    }
}
