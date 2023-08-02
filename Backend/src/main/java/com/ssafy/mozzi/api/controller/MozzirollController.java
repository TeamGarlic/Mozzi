package com.ssafy.mozzi.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.api.service.MozzirollService;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/mozzirolls")
@RequiredArgsConstructor
public class MozzirollController {
    private final MozzirollService mozzirollService;

    @PostMapping("/link")
    public ResponseEntity<? extends BaseResponseBody<Long>> link(@RequestHeader String Authorization, @RequestBody
    MozziLinkPostRequest request) {
        return mozzirollService.link(request, Authorization);
    }
}
