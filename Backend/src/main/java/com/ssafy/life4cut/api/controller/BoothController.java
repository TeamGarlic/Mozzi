package com.ssafy.life4cut.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.life4cut.api.request.ConnectionPostReq;
import com.ssafy.life4cut.api.request.SessionPostReq;
import com.ssafy.life4cut.api.response.ConnectionPostRes;
import com.ssafy.life4cut.api.response.SessionRes;
import com.ssafy.life4cut.api.service.BoothService;
import com.ssafy.life4cut.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

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
     * @see com.ssafy.life4cut.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Session
     */
    @PostMapping
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> createBooth(
        @RequestBody SessionPostReq request) throws
        Exception {
        return new ResponseEntity<>(boothService.createBooth(request), HttpStatus.OK);
    }

    /**
     * 접속하고자 하는 share code에 해당하는, 부스의 session id를 반환 받습니다.
     * @param shareCode booth에 접속할 수 있는 공유 코드입니다
     * @return share code에 해당 되는 부스의 session id를 반환합니다.
     * @see com.ssafy.life4cut.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Session
     */
    @GetMapping("/{shareCode}")
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> joinBooth(@PathVariable String shareCode) throws
        Exception {
        return new ResponseEntity<>(boothService.joinBooth(shareCode), HttpStatus.OK);
    }

    /**
     * Session ID를 기준으로, Openvidu에 접속할 수 있는 Connection Token을 반환합니다
     * @param request 접속하고자 하는 부스의 session id를 담고 있습니다.
     * @return openvidu connection token을 반환합니다.
     * @see com.ssafy.life4cut.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Connection
     */
    @PostMapping("/connections")
    public ResponseEntity<? extends BaseResponseBody<ConnectionPostRes>> createConnection(
        @RequestBody ConnectionPostReq request) throws Exception {
        return new ResponseEntity<>(boothService.getConnectionToken(request), HttpStatus.OK);
    }
}
