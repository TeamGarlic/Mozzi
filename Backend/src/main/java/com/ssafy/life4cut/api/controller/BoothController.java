package com.ssafy.life4cut.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.life4cut.api.request.SessionCreatePostReq;
import com.ssafy.life4cut.api.service.BoothService;

import lombok.RequiredArgsConstructor;

// TODO: test code for h2. need to change it. (it is just basic check code)
@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class BoothController {
    private final BoothService boothService;

    @PostMapping
    public ResponseEntity<String> createSession(@RequestBody SessionCreatePostReq request) {
        boothService.join(request.getCustomSessionId());
        return new ResponseEntity<>(request.getCustomSessionId(), HttpStatus.OK);
    }
}
