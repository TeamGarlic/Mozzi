package com.ssafy.mozzi.api.service;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.response.FileMozzirollPostRes;

public interface FileService {
    FileMozzirollPostRes saveMozziroll(MultipartFile file, String accessToken);
}
