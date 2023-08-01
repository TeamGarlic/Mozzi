package com.ssafy.mozzi.api.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.api.service.FileService;
import com.ssafy.mozzi.common.model.ItemCacheControl;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;
    private final ItemCacheControl cacheControl;

    @PostMapping(value = "/mozziroll/upload")
    public ResponseEntity<? extends BaseResponseBody<FileMozzirollPostRes>> saveMozziroll(
        @RequestHeader("Authorization") String accessToken,
        @RequestParam("file") MultipartFile file) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore())
            .body(
                BaseResponseBody.<FileMozzirollPostRes>builder()
                    .message("Save mozziroll success")
                    .data(fileService.saveMozziroll(file, accessToken))
                    .build()
            );
    }
}
