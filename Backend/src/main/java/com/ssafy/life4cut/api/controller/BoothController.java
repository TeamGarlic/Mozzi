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

    @PostMapping
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> createBooth(
        @RequestBody SessionPostReq request) throws
        Exception {
        return new ResponseEntity<>(boothService.createBooth(request), HttpStatus.OK);
    }

    @GetMapping("/{shareCode}")
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> joinBooth(@PathVariable String shareCode) throws
        Exception {
        return new ResponseEntity<>(boothService.joinBooth(shareCode), HttpStatus.OK);
    }

    @PostMapping("/connections")
    public ResponseEntity<? extends BaseResponseBody<ConnectionPostRes>> createConnection(
        @RequestBody ConnectionPostReq request) throws Exception {
        return new ResponseEntity<>(boothService.getConnectionToken(request), HttpStatus.OK);
    }
}
