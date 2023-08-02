package com.ssafy.mozzi.common.util;

import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;

public class FileUtil {
    /**
     * MultipartFile을 InputStream으로 변환해주는 함수
     * @param file MultipartFile
     * @return InputStream 형태의 파일
     */
    static public InputStream generateStreamFromFile(MultipartFile file) {
        InputStream inputStream = null;
        try {
            inputStream = file.getInputStream();
        } catch (Exception e) {
            throw new CloudStorageSaveFailException("파일 변환 실패");
        }
        return inputStream;
    }
}

