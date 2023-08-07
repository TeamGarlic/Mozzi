package com.ssafy.mozzi.api.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.api.response.MozzirollLikeRes;
import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.api.service.MozzirollService;
import com.ssafy.mozzi.common.exception.handler.AlreadyLinkedMozziException;
import com.ssafy.mozzi.common.exception.handler.BoothNotExistsException;
import com.ssafy.mozzi.common.exception.handler.MozzirollNotExistsException;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;
import com.ssafy.mozzi.common.exception.handler.UserIdNotExistsException;
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
@RequestMapping("/mozzirolls")
@RequiredArgsConstructor
@Tag(name = "Mozziroll 컨트롤러", description = "Mozziroll을 관리하는 컨트롤러입니다")
public class MozzirollController {
    private final MozzirollService mozzirollService;

    /**
     * 방 구성원에게 Mozziroll 마이페이지 등록 요청을 받아, 유효성 확인 후 동록합니다.
     *
     * @see com.ssafy.mozzi.api.service.MozzirollServiceImpl
     */
    @Operation(summary = "Mozziroll 연결", description = "방장이 올린 Mozziroll을 자신의 마이페이지에 연결합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Mozziroll 연결 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "이미 사용자에게 연결 되어 있는 Mozziroll 입니다.",
            content = @Content(schema = @Schema(implementation = AlreadyLinkedMozziException.AlreadyLinkedMozziResponse.class))),
        @ApiResponse(responseCode = "401", description = "요청한 모찌롤의 주인(방장)과 같은 방에 없어 권한이 부족합니다",
            content = @Content(schema = @Schema(implementation = UnAuthorizedException.UnAuthorizedResponse.class))),
        @ApiResponse(responseCode = "404", description = "요청한 모찌롤이 존재하지 않습니다.",
            content = @Content(schema = @Schema(implementation = MozzirollNotExistsException.MozzirollNotExistsResponse.class))),
        @ApiResponse(responseCode = "404", description = "요청한 부스가 존재하지 않습니다.",
            content = @Content(schema = @Schema(implementation = BoothNotExistsException.BoothNotExistsResponse.class))),
        @ApiResponse(responseCode = "404", description = "User Id가 존재하지 않습니다.",
            content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))
    })
    @PostMapping("/link")
    public ResponseEntity<? extends BaseResponseBody<Long>> link(@RequestHeader String Authorization, @RequestBody
    MozziLinkPostRequest request) {

        return ResponseEntity.ok()
            .body(
                BaseResponseBody.<Long>builder()
                    .message("Mozziroll Linked")
                    .data(mozzirollService.link(request, Authorization))
                    .build()
            );
    }

    /**
     * 유저의 모찌 목록을 조회합니다.
     * @param accessToken 사용자의 Token
     * @see MozzirollService
     */
    @Operation(summary = "사용자 Mozziroll 조회", description = "사용자의 모찌롤 정보를 페이징 처리하여 반환합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "사용자 Mozziroll 페이징 조회 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "404", description = "User Id가 존재하지 않습니다.",
            content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))
    })
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

    /**
     * 모찌롤을 좋아요 합니다. 이미 좋아요 한 경우 좋아요가 해제됩니다.
     * @param accessToken 사용자의 Token
     * @param userMozzirollId 사용자가 만든 모찌롤 게시물의 아이디
     * @see MozzirollService
     * @see MozzirollLikeRes
     */
    @Operation(summary = "모찌롤 좋아요 Toggle", description = "모찌롤을 좋아요 합니다. 이미 좋아요 한 경우 좋아요가 해제됩니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "사용자 Mozziroll 페이징 조회 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 정보",
            content = @Content(schema = @Schema(implementation = UserIdNotExistsException.UserIdNotExistsResponse.class))),
        @ApiResponse(responseCode = "403", description = "잘못된 accessToken 또는 url"),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(implementation = BaseErrorResponse.InternalServerErrorResponse.class)))
    })
    @PostMapping("/{userMozzirollId}")
    public ResponseEntity<? extends BaseResponseBody<MozzirollLikeRes>> likeMozziroll(
        @RequestHeader("Authorization") String accessToken,
        @PathVariable long userMozzirollId) {
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(
                BaseResponseBody.<MozzirollLikeRes>builder()
                    .message("mozziroll like or dislike success")
                    .data(mozzirollService.likeMozziroll(accessToken, userMozzirollId))
                    .build()
            );
    }
}
