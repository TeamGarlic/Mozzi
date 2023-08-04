package com.ssafy.mozzi.api.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.api.service.MozzirollService;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/mozzirolls")
@RequiredArgsConstructor
public class MozzirollController {
    private final MozzirollService mozzirollService;

    /**
     * 방 구성원에게 Mozziroll 마이페이지 등록 요청을 받아, 유효성 확인 후 동록합니다.
     *
     * @see com.ssafy.mozzi.api.service.MozzirollServiceImpl
     */
    @PostMapping("/link")
    public ResponseEntity<? extends BaseResponseBody<Long>> link(@RequestHeader String Authorization, @RequestBody
    MozziLinkPostRequest request) {
        return mozzirollService.link(request, Authorization);
    }

    /**
     * 유저의 모찌 목록을 조회합니다.
     * @param accessToken 사용자의 Token
     * @see MozzirollService
     */
    @GetMapping()
    public ResponseEntity<? extends BaseResponseBody<UserMozzirollGetRes>> userMozziroll(
        @RequestHeader("Authorization") String accessToken,
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                BaseResponseBody.<UserMozzirollGetRes>builder()
                    .message("Mozziroll list by user success")
                    .data(mozzirollService.getMozzirollsByUser(accessToken, pageNum, pageSize))
                    .build()
            );
    }
}
