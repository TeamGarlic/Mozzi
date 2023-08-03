package com.ssafy.mozzi.common.util.mapper;

import java.util.Optional;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;

import com.oracle.bmc.objectstorage.responses.GetObjectResponse;
import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.common.dto.ObjectFileItem;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;

public class FileMapper {
    public static FileMozzirollPostRes toFileMozzirollPostRes(Mozziroll mozziroll) {
        return FileMozzirollPostRes.builder()
            .id(mozziroll.getId())
            .build();
    }

    public static ObjectFileItem toMozzirollItem(GetObjectResponse getObjectResponse,
        Optional<Mozziroll> mozziroll) {
        return ObjectFileItem.builder()
            .file(new InputStreamResource(getObjectResponse.getInputStream()))
            .fileName(mozziroll.get().getObjectName())
            .build();
    }

    public static Resource toResource(GetObjectResponse getObjectResponse) {
        return new InputStreamResource(getObjectResponse.getInputStream());
    }
}