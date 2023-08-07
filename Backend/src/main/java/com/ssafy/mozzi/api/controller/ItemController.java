package com.ssafy.mozzi.api.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.response.FrameListGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundPostRes;
import com.ssafy.mozzi.api.response.ItemStickerGetRes;
import com.ssafy.mozzi.api.service.ItemService;
import com.ssafy.mozzi.common.dto.FrameClipItem;
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

        return ResponseEntity.ok()
            .cacheControl(cacheControl.getCacheControl())
            .body(BaseResponseBody.<ItemBackgroundGetRes>builder()
                .message("Background list" + pageNum)
                .data(itemService.getBackgroundRes(pageNum, pageSize))
                .build()
            );
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

        return ResponseEntity.ok()
            .cacheControl(cacheControl.getCacheControl())
            .body(
                BaseResponseBody.<ItemStickerGetRes>builder()
                    .message("sticker list page " + pageNum)
                    .data(itemService.getStickerRes(pageNum, pageSize))
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

        return ResponseEntity.ok()
            .cacheControl(cacheControl.getCacheControl())
            .body(
                BaseResponseBody.<FrameListGetRes>builder()
                    .message("frame list success")
                    .data(itemService.getFrameList())
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
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title) {

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore())
            .body(
                BaseResponseBody.<ItemBackgroundPostRes>builder()
                    .message("Save background success")
                    .data(itemService.saveBackground(file, title))
                    .build()
            );
    }

    /**
     * 프레임 업로드 비지니스 로직
     * @param file MultipartFile
     * @param title String
     * @param rects FrameClipItem[]
     * @see ItemService
     */
    @PostMapping("/frame")
    public ResponseEntity<? extends BaseResponseBody<String>> saveFrame(
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title) {

        String response = itemService.saveFrame(file, title);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore())
            .body(
                BaseResponseBody.<String>builder()
                    .message("frame upload success")
                    .data(response)
                    .build()
            );
    }

    /**
     * 프레임 클립 업로드 비지니스 로직
     * @param frameId long
     * @param frameClipItems FrameClipItem[]
     * @see ItemService
     */
    @PostMapping("/frame/{frameId}")
    public ResponseEntity<? extends BaseResponseBody<String>> saveFrameClips(
        @PathVariable("frameId") long frameId,
        @RequestBody FrameClipItem[] frameClipItems) {

        String response = itemService.saveFrameClips(frameId, frameClipItems);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore())
            .body(
                BaseResponseBody.<String>builder()
                    .message("frame upload success")
                    .data(response)
                    .build());
    }
}
