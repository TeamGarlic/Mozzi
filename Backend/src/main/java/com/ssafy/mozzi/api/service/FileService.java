package com.ssafy.mozzi.api.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.common.dto.ObjectFileItem;

public interface FileService {
    FileMozzirollPostRes saveMozziroll(MultipartFile file, String title, String accessToken, int width, int height);

    ObjectFileItem downloadMozziroll(String mozzirollId);

    Resource getObject(String ObjectName);
}
