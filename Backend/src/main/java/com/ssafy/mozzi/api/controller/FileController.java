package com.ssafy.mozzi.api.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.service.FileService;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping(value = "/mozziroll") //, produces = MediaType.APPLICATION_JSON_VALUE
    public ResponseEntity<? extends BaseResponseBody> saveMozziRoll(@RequestParam("file") MultipartFile file) throws
        IOException {
        fileService.saveMozziRoll(file);

        return ResponseEntity.ok()
            .body(BaseResponseBody.builder()
                .message("save mozziroll fetched")
                .build()
            );
    }
}
