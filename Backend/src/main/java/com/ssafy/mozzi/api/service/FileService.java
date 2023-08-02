package com.ssafy.mozzi.api.service;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.common.dto.MozzirollFileItem;

public interface FileService {
    FileMozzirollPostRes saveMozziroll(MultipartFile file, String title, String accessToken);

    MozzirollFileItem downloadMozziroll(String mozzirollId);
}
