package com.ssafy.mozzi.api.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.mozzi.api.request.ConnectionPostReq;
import com.ssafy.mozzi.api.request.SessionPostReq;
import com.ssafy.mozzi.api.response.ConnectionPostRes;
import com.ssafy.mozzi.api.response.SessionRes;
import com.ssafy.mozzi.api.service.BoothService;
import com.ssafy.mozzi.common.exception.handler.AccessTokenNotExistsException;
import com.ssafy.mozzi.common.exception.handler.DuplicateShareCodeException;
import com.ssafy.mozzi.common.exception.handler.InvalidSessionIdException;
import com.ssafy.mozzi.common.exception.handler.ShareCodeNotExistException;
import com.ssafy.mozzi.common.model.response.BaseErrorResponse;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
@Tag(name = "부스 컨트롤러", description = "WebRTC 부스를 담당하는 컨트롤러입니다.")
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
    @Operation(summary = "부스 생성", description = "JWT 토큰과 생성하고자 하는 부스의 공유 코드(생략 가능)을 받아 새로운 부스를 생성합니다")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "부스 생성 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "중복된 공유 코드", content = @Content(schema = @Schema(implementation = DuplicateShareCodeException.DuplicateShareCodeResponse.class))),
        @ApiResponse(responseCode = "401", description = "JWT TOKEN 없음", content = @Content(schema = @Schema(implementation = AccessTokenNotExistsException.AccessTokenNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @PostMapping
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> createBooth(@RequestHeader String Authorization,
        @RequestBody SessionPostReq request) throws Exception {

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<SessionRes>builder()
                .message("Requested booth created")
                .data(boothService.createBooth(request, Authorization))
                .build());
    }

    /**
     * 접속하고자 하는 share code에 해당하는, 부스의 session id를 반환 받습니다.
     * @param shareCode booth에 접속할 수 있는 공유 코드입니다
     * @return share code에 해당 되는 부스의 session id를 반환합니다.
     * @see com.ssafy.mozzi.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Session
     */
    @Operation(summary = "부스 참여", description = "부스의 공유 코드를 이용하여 부스의 session id를 얻습니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "부스 참여 정보 획득 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "존재하지 않는 공유 코드", content = @Content(schema = @Schema(implementation = ShareCodeNotExistException.ShareCodeNotExistResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @GetMapping("/{shareCode}")
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> joinBooth(@PathVariable String shareCode) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<SessionRes>builder()
                .message("Requested booth exists")
                .data(boothService.joinBooth(shareCode))
                .build());
    }

    /**
     * Session ID를 기준으로, Openvidu에 접속할 수 있는 Connection Token을 반환합니다
     * @param request 접속하고자 하는 부스의 session id를 담고 있습니다.
     * @return openvidu connection token을 반환합니다.
     * @see com.ssafy.mozzi.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Connection
     */
    @Operation(summary = "Connection 생성", description = "Openvidu Session Id를 이용하여 Websocket connection을 생성합니다")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Connection 생성 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "존재하지 않는 Session ID", content = @Content(schema = @Schema(implementation = InvalidSessionIdException.InvalidSessionIdResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @PostMapping("/connections")
    public ResponseEntity<? extends BaseResponseBody<ConnectionPostRes>> createConnection(
        @RequestHeader(required = false) String Authorization, @RequestBody ConnectionPostReq request) throws
        Exception {

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<ConnectionPostRes>builder()
                .message("Connection Token created")
                .data(boothService.getConnectionToken(request, Authorization))
                .build());
    }

    /**
     * Session ID를 기준으로, 해당 Booth 를 삭제합니다.
     * @param sessionId 접속하고자 하는 부스의 session id를 담고 있습니다.
     * @return SessionRes 를 반환합니다.
     * @see com.ssafy.mozzi.api.service.BoothServiceImpl
     * @see io.openvidu.java.client.Session
     */
    @Operation(summary = "부스 삭제", description = "Openvidu Session Id를 이용해 Session을 삭제합니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "부스 삭제 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "존재하지 않는 Session ID", content = @Content(schema = @Schema(implementation = InvalidSessionIdException.InvalidSessionIdResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러", content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))})
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<? extends BaseResponseBody<SessionRes>> deleteBooth(@PathVariable String sessionId) throws
        Exception {

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<SessionRes>builder()
                .message("deleted exist booth")
                .data(boothService.deleteBooth(sessionId))
                .build());
    }

    @Operation(ignoreJsonView = true)
    // TODO: 배포시 삭제
    @GetMapping("/testpath/{shareCode}")
    public ResponseEntity<? extends BaseResponseBody<ConnectionPostRes>> testConnection(
        @PathVariable String shareCode) throws Exception {
        String sessionId;
        try {
            SessionPostReq req = new SessionPostReq();
            req.setShareCode(shareCode);
            sessionId = boothService.createBooth(req,
                    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjkwOTU0NzYwLCJleHAiOjEyMTY5MDk1NDc2MH0.RF8qFqAwbcbDdS1jl9Q9vAb5RzOZ8j6xmjMqWAApKio")
                .getSessionId();
        } catch (DuplicateShareCodeException exception) {
            sessionId = boothService.joinBooth(shareCode).getSessionId();
        }

        ConnectionPostReq connectionPostReq = new ConnectionPostReq();
        connectionPostReq.setSessionId(sessionId);

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(BaseResponseBody.<ConnectionPostRes>builder()
                .message("Connection Token created")
                .data(boothService.getConnectionToken(connectionPostReq,
                    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjkwOTU0NzYwLCJleHAiOjEyMTY5MDk1NDc2MH0.RF8qFqAwbcbDdS1jl9Q9vAb5RzOZ8j6xmjMqWAApKio"))
                .build());
    }
}
