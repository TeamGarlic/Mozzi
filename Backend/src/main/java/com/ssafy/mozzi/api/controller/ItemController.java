package com.ssafy.mozzi.api.controller;

import java.nio.charset.StandardCharsets;

import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.response.FrameListGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundPostRes;
import com.ssafy.mozzi.api.response.ItemStickerGetRes;
import com.ssafy.mozzi.api.service.ItemService;
import com.ssafy.mozzi.common.model.ItemCacheControl;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

/**
 * Item 관련 API 요청을 위한 Controller
 */
@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/items")
public class ItemController {
    private final ItemService itemService;
    private final ItemCacheControl cacheControl;

    /**
     * 배경 화면 GET 응답을 위한 메소드
     *
     * @param pageNum int
     * @param pageSize int
     * @return ResponseEntity<? extends ItemBackgroundGetRes>
     * @see ItemService
     */
    @GetMapping("/backgrounds")
    public ResponseEntity<? extends BaseResponseBody<ItemBackgroundGetRes>> getBackgrounds(
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        ItemBackgroundGetRes responseData = itemService.getBackgroundRes(pageNum, pageSize);

        return ResponseEntity.ok()
            .cacheControl(cacheControl.getCacheControl())
            .body(BaseResponseBody.<ItemBackgroundGetRes>builder()
                .message("Background fetched")
                .data(responseData)
                .build()
            );
    }

    /**
     * 배경 화면 ObjectName으로 배경 이미지 반환하는 메소드
     *
     * @param backgroundId String\
     * @return ResponseEntity<Resource>
     * @see ItemService
     */
    @GetMapping("/background/{backgroundId}")
    public ResponseEntity<Resource> getBackground(
        @PathVariable("backgroundId") String backgroundId) {
        Resource resource = itemService.getBackgroundImg(backgroundId);

        return ResponseEntity.ok()
            .cacheControl(cacheControl.getCacheControl())
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment() // (6)
                .filename(resource.getFilename(), StandardCharsets.UTF_8)
                .build()
                .toString())
            .body(resource);
    }

    /**
     * 스티커 GET 응답을 위한 메소드
     *
     * @param pageNum int
     * @param pageSize int
     * @return ResponseEntity<? extends ItemStickerGetRes>
     * @see ItemService
     */
    @GetMapping("/stickers")
    public ResponseEntity<? extends BaseResponseBody<ItemStickerGetRes>> getStickers(
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        ItemStickerGetRes responseData = itemService.getStickerRes(pageNum, pageSize);
        return ResponseEntity.ok()
            .cacheControl(cacheControl.getCacheControl())
            .body(
                BaseResponseBody.<ItemStickerGetRes>builder()
                    .message("sticker list page " + pageNum)
                    .data(responseData)
                    .build()
            );
    }

    /**
     * 프레임 리스트 GET 응답을 위한 메소드
     *
     * @return ResponseEntity<? extends BaseResponseBody>
     * @see ItemService
     */
    @GetMapping("/frames")
    public ResponseEntity<? extends BaseResponseBody<FrameListGetRes>> getFrames() {
        FrameListGetRes response = itemService.getFrameList();
        return ResponseEntity.ok()
            .cacheControl(cacheControl.getCacheControl())
            .body(
                BaseResponseBody.<FrameListGetRes>builder()
                    .message("success")
                    .data(response)
                    .build()
            );
    }

    /**
     * 가상 배경 업로드
     *
     * @param file MultipartFile
     * @return ResponseEntity<? extends BaseResponseBody < ItemBackgroundPostRes>>
     * @see ItemService
     */
    @PostMapping("/background")
    public ResponseEntity<? extends BaseResponseBody<ItemBackgroundPostRes>> saveBackground(
        @RequestParam("file") MultipartFile file) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore())
            .body(
                BaseResponseBody.<ItemBackgroundPostRes>builder()
                    .message("Save background success")
                    .data(itemService.saveBackground(file))
                    .build()
            );
    }
}
