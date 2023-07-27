package com.ssafy.mozzi.api.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.mozzi.api.request.ConnectionPostReq;
import com.ssafy.mozzi.api.request.SessionPostReq;
import com.ssafy.mozzi.api.response.ConnectionPostRes;
import com.ssafy.mozzi.api.response.SessionRes;
import com.ssafy.mozzi.api.service.BoothService;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class BoothController {
    private final BoothService boothService;

    /**
     * 생성하고자하는 정보(share code)를 Body로 받아 부스를 생성 후, 부스에 관한 정보(share code, session id)를 반환합니다.
     * share code를 지정 하지 않은 경우, 랜덤하게 생성하여 반환합니다.
     * @param request 부스의 share code를 가지고 있습니다.
     * @return share code와 session id를 가지고 있는 반환 타입입니다
     * @see com.ssafy.mozzi.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Session
     */
    @PostMapping
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> createBooth(
        @RequestBody SessionPostReq request) throws
        Exception {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                boothService.createBooth(request)
            );
    }

    /**
     * 접속하고자 하는 share code에 해당하는, 부스의 session id를 반환 받습니다.
     * @param shareCode booth에 접속할 수 있는 공유 코드입니다
     * @return share code에 해당 되는 부스의 session id를 반환합니다.
     * @see com.ssafy.mozzi.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Session
     */
    @GetMapping("/{shareCode}")
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> joinBooth(@PathVariable String shareCode) throws
        Exception {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                boothService.joinBooth(shareCode)
            );
    }

    /**
     * Session ID를 기준으로, Openvidu에 접속할 수 있는 Connection Token을 반환합니다
     * @param request 접속하고자 하는 부스의 session id를 담고 있습니다.
     * @return openvidu connection token을 반환합니다.
     * @see com.ssafy.mozzi.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Connection
     */
    @PostMapping("/connections")
    public ResponseEntity<? extends BaseResponseBody<ConnectionPostRes>> createConnection(
        @RequestBody ConnectionPostReq request) throws Exception {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                boothService.getConnectionToken(request)
            );
    }

    /**
     * Session ID를 기준으로, 해당 Booth 를 삭제합니다.
     * @param sessionId 접속하고자 하는 부스의 session id를 담고 있습니다.
     * @return SessionRes 를 반환합니다.
     * @see com.ssafy.mozzi.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Session
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> deleteBooth(@PathVariable String sessionId) throws
        Exception {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                boothService.deleteBooth(sessionId)
            );
    }
}
