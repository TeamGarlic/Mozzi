package com.ssafy.life4cut.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.life4cut.api.response.FrameListGetRes;
import com.ssafy.life4cut.api.response.ItemBackgroundGetRes;
import com.ssafy.life4cut.api.response.ItemStickerGetRes;
import com.ssafy.life4cut.api.service.ItemService;
import com.ssafy.life4cut.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

/**
 * Item 관련 API 요청을 위한 Controller
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/items")
public class ItemController {
    private final ItemService itemService;

    /**
     * 배경 화면 GET 응답을 위한 메소드
     *
     * @param pageNum int
     * @param pageSize int
     * @return ResponseEntity<? extends ItemBackgroundGetRes>
     * @see ItemService
     */
    @GetMapping("/backgrounds")
    public ResponseEntity<? extends BaseResponseBody> getBackgrounds(
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        ItemBackgroundGetRes responseData = itemService.getBackgroundRes(pageNum, pageSize);
        return new ResponseEntity<>(
            BaseResponseBody.<ItemBackgroundGetRes>builder()
                .message("")
                .data(responseData)
                .build(), HttpStatus.OK);
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
    public ResponseEntity<? extends BaseResponseBody> getStickers(
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        ItemStickerGetRes responseData = itemService.getStickerRes(pageNum, pageSize);
        return new ResponseEntity<>(
            BaseResponseBody.<ItemStickerGetRes>builder()
                .message("sticker list page " + String.valueOf(pageNum))
                .data(responseData)
                .build(), HttpStatus.OK);
    }

    /**
     * 프레임 리스트 GET 응답을 위한 메소드
     *
     * @return ResponseEntity<? extends BaseResponseBody>
     * @see ItemService
     */
    @GetMapping("/frames")
    public ResponseEntity<? extends BaseResponseBody> getFrames() {
        FrameListGetRes response = itemService.getFrameList();
        return new ResponseEntity<>(
            BaseResponseBody.<FrameListGetRes>builder()
                .message("success")
                .data(response)
                .build(), HttpStatus.OK);
    }
}
