package com.ssafy.mozzi.api.service;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.response.FileMozziRollPostRes;

public interface FileService {
    FileMozziRollPostRes saveMozziRoll(MultipartFile file, String accessToken);
}
