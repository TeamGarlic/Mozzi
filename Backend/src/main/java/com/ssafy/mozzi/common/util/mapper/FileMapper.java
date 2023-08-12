package com.ssafy.mozzi.common.util.mapper;

import java.util.Optional;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;

import com.oracle.bmc.objectstorage.responses.GetObjectResponse;
import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.common.dto.ObjectFileItem;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;

/**
 * File 관련 Object 와 Request/Response Data Object를 연결해주는 Mapper
 */
public class FileMapper {
    /**
     *  Mozziroll Object 를 toFileMozzirollPostRes 로 변환
     *
     * @param mozziroll Mozziroll
     * @return toFileMozzirollPostRes
     */
    public static FileMozzirollPostRes toFileMozzirollPostRes(Mozziroll mozziroll) {
        return FileMozzirollPostRes.builder()
            .id(mozziroll.getId())
            .build();
    }

    /**
     *  GetObjectResponse Object 를 ObjectFileItem 로 변환
     *
     * @param getObjectResponse GetObjectResponse
     * @param mozziroll Optional Mozziroll
     * @return ObjectFileItem
     */
    public static ObjectFileItem toObjectFileItem(GetObjectResponse getObjectResponse, Optional<Mozziroll> mozziroll) {
        return ObjectFileItem.builder()
            .file(toResource(getObjectResponse))
            .fileName(mozziroll.get().getObjectName())
            .build();
    }

    /**
     *  GetObjectResponse Object 를 Resource 로 변환
     *
     * @param getObjectResponse GetObjectResponse
     * @return Resource
     */
    public static Resource toResource(GetObjectResponse getObjectResponse) {
        return new InputStreamResource(getObjectResponse.getInputStream());
    }
}
