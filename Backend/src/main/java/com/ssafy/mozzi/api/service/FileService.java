package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.common.dto.MozzirollFileItem;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    FileMozzirollPostRes saveMozziroll(MultipartFile file, String accessToken);
    MozzirollFileItem downloadMozziroll(String mozzirollId);
}
