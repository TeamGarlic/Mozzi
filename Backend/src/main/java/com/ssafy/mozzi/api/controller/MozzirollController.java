package com.ssafy.mozzi.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.api.request.PostUserMozzirollPostReq;
import com.ssafy.mozzi.api.response.MozzirollLikeRes;
import com.ssafy.mozzi.api.response.PopularUserMozzirollGetlRes;
import com.ssafy.mozzi.api.response.PostUserMozzirollPostRes;
import com.ssafy.mozzi.api.response.UserMozzirollDeleteRes;
import com.ssafy.mozzi.api.response.UserMozzirollDetailGetRes;
import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.api.service.MozzirollService;
import com.ssafy.mozzi.common.model.APICacheControl;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;
import com.ssafy.mozzi.config.SwaggerConfig;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

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
            content = @Content(schema = @Schema(ref = "#/components/schemas/AlreadyLinkedMozzi"))),
        @ApiResponse(responseCode = "401", description = "요청한 모찌롤의 주인(방장)과 같은 방에 없어 권한이 부족합니다",
            content = @Content(schema = @Schema(ref = "#/components/schemas/UnAuthorized"))),
        @ApiResponse(responseCode = "404", description = "Not Found", content = @Content(examples = {
            @ExampleObject(name = "UserIdNotExists", description = "User Id가 존재하지 않습니다.", value = SwaggerConfig.RES_UserIdNotExists),
            @ExampleObject(name = "BoothNotExists", description = "요청한 부스가 존재하지 않습니다.", value = SwaggerConfig.RES_BoothNotExists),
            @ExampleObject(name = "MozzirollNotExists", description = "요청한 모찌롤이 존재하지 않습니다.", value = SwaggerConfig.RES_MozzirollNotExists)
        })),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @PostMapping("/link")
    public ResponseEntity<? extends BaseResponseBody<Long>> link(@RequestHeader String Authorization, @RequestBody
    MozziLinkPostRequest request) {

        return ResponseEntity.ok()
            .cacheControl(APICacheControl.noCache)
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
        @ApiResponse(responseCode = "401", description = "유효하지 않은 Access Token", content = @Content(schema = @Schema(ref = "#/components/schemas/InvalidAccessToken"))),
        @ApiResponse(responseCode = "404", description = "User Id가 존재하지 않습니다.",
            content = @Content(schema = @Schema(ref = "#/components/schemas/UserIdNotExists"))),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @GetMapping()
    public ResponseEntity<? extends BaseResponseBody<UserMozzirollGetRes>> userMozziroll(
        @RequestHeader("Authorization") String accessToken,
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        return ResponseEntity.ok()
            .cacheControl(APICacheControl.noCache)
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
        @ApiResponse(responseCode = "401", description = "유효하지 않는 Access Token", content = @Content(schema = @Schema(ref = "#/components/schemas/InvalidAccessToken"))),
        @ApiResponse(responseCode = "404", description = "Bad Request", content = @Content(examples = {
            @ExampleObject(name = "UserIdNotExists", description = "존재하지 않는 User Id", value = SwaggerConfig.RES_UserIdNotExists),
            @ExampleObject(name = "MozzirollNotExists", description = "존재하지 않는 Mozziroll", value = SwaggerConfig.RES_MozzirollNotExists)
        })),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @PostMapping("/like/{userMozzirollId}")
    public ResponseEntity<? extends BaseResponseBody<MozzirollLikeRes>> likeMozziroll(
        @RequestHeader("Authorization") String accessToken,
        @PathVariable long userMozzirollId) {
        return ResponseEntity.ok()
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<MozzirollLikeRes>builder()
                    .message("mozziroll like or dislike success")
                    .data(mozzirollService.likeMozziroll(accessToken, userMozzirollId))
                    .build()
            );
    }

    /**
     * 좋아요 순으로 유저 모찌롤 목록을 조회합니다. posted 값이 true 이며, deleted 값이 false 인 게시물만 출력합니다.
     * @param accessToken 사용자의 Token
     * @param pageNum 페이지 숫자
     * @param pageSize 페이지 크기
     * @see MozzirollService
     */
    @Operation(summary = "커뮤니티의 유저 모찌롤을 좋아요 순 목록으로 조회", description = "커뮤니티의 유저 모찌롤을 좋아요 순 목록으로 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "좋아요 순 userMozziroll 페이징 조회 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "401", description = "유효하지 않는 Access Token", content = @Content(schema = @Schema(ref = "#/components/schemas/InvalidAccessToken"))),
        @ApiResponse(responseCode = "404", description = "존재 하지 않는 User Id", content = @Content(schema = @Schema(ref = "#/components/schemas/UserIdNotExists"))),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @GetMapping("/popular")
    public ResponseEntity<? extends BaseResponseBody<PopularUserMozzirollGetlRes>> getPopularUserMozzirolls(
        @RequestHeader(value = "Authorization", required = false) String accessToken,
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
        @RequestParam(value = "sorted", defaultValue = "time") String sorted) {
        return ResponseEntity.ok()
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<PopularUserMozzirollGetlRes>builder()
                    .message("get popular user mozziroll list success")
                    .data(mozzirollService.getPopularUserMozzirolls(accessToken, pageNum, pageSize, sorted))
                    .build()
            );
    }

    /**
     * 유저의 모찌롤을 커뮤니티에 등록/해제를 하는 기능입니다.
     * @param accessToken 사용자의 Token
     * @param postUserMozzirollPostReq UserMozziroll의 id가 있는 DTO
     * @see MozzirollService
     * @see MozzirollLikeRes
     */
    @Operation(summary = "유저의 모찌롤을 커뮤니티에 등록/해제하는 Toggle", description = "유저의 모찌롤을 커뮤니티에 등록->해제 or 해제->등록합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "유저의 모찌롤 커뮤니티에 등록/해제 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "401", description = "UnAuthorized", content = @Content(examples = {
            @ExampleObject(name = "UnAuthorized", description = "User Mozziroll의 주인이 아니여서 권한이 없음", value = SwaggerConfig.RES_UnAuthorized),
            @ExampleObject(name = "InvalidAccessToken", description = "유효하지 않는 Access Token", value = SwaggerConfig.RES_InvalidAccessToken)
        })),
        @ApiResponse(responseCode = "404", description = "Not Found", content = @Content(examples = {
            @ExampleObject(name = "UserIdNotExistsException", description = "존재하지 않는 User Id", value = SwaggerConfig.RES_UserIdNotExists),
            @ExampleObject(name = "MozzirollNotExists", description = "Mozziroll Not Exists", value = SwaggerConfig.RES_MozzirollNotExists)
        })),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @PostMapping("/post")
    public ResponseEntity<? extends BaseResponseBody<PostUserMozzirollPostRes>> postUserMozziroll(
        @RequestHeader("Authorization") String accessToken,
        @RequestBody PostUserMozzirollPostReq postUserMozzirollPostReq) {
        return ResponseEntity.ok()
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<PostUserMozzirollPostRes>builder()
                    .message("UserMozziroll post or unpost in community success")
                    .data(mozzirollService.postUserMozziroll(accessToken, postUserMozzirollPostReq))
                    .build()
            );
    }

    /**
     * userMozzirollId 에 해당하는 userMozziroll 을 삭제합니다. (soft delete) 만든 사람 외에는 삭제가 불가능 합니다.
     * @param accessToken 사용자의 Token
     * @param userMozzirollId 유저 모찌롤의 Id
     * @see MozzirollService
     */
    @Operation(summary = "유저 모찌롤 삭제", description = "userMozzirollId 에 해당하는 userMozziroll 을 삭제합니다. (soft delete) 만든 사람 외에는 삭제가 불가능 합니다. 만약 삭제될 때 관계된 mozziroll 의 부모가 더이상 없을경우 mozziroll 또한 같이 삭제합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "유저 모찌롤 삭제 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "401", description = "UnAuthorized", content = @Content(examples = {
            @ExampleObject(name = "UnAuthorized", description = "User Mozziroll의 주인이 아니여서 권한이 없음", value = SwaggerConfig.RES_UnAuthorized),
            @ExampleObject(name = "InvalidAccessToken", description = "유효하지 않는 Access Token", value = SwaggerConfig.RES_InvalidAccessToken)
        })),
        @ApiResponse(responseCode = "404", description = "Not Found", content = @Content(examples = {
            @ExampleObject(name = "UserIdNotExistsException", description = "존재하지 않는 User Id", value = SwaggerConfig.RES_UserIdNotExists),
            @ExampleObject(name = "MozzirollNotExists", description = "Mozziroll Not Exists", value = SwaggerConfig.RES_MozzirollNotExists)
        })),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @DeleteMapping("/{userMozzirollId}")
    public ResponseEntity<? extends BaseResponseBody<UserMozzirollDeleteRes>> deleteUserMozziroll(
        @RequestHeader(value = "Authorization", required = false) String accessToken,
        @PathVariable("userMozzirollId") long userMozzirollId) {
        return ResponseEntity.ok()
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<UserMozzirollDeleteRes>builder()
                    .message("delete userMozziroll success")
                    .data(mozzirollService.deleteUserMozziroll(accessToken, userMozzirollId))
                    .build()
            );
    }

    /**
     * 유저모찌롤의 상세 페이지 데이터를 반환합니다.
     * @param accessToken 사용자의 Token
     * @see MozzirollService
     */
    @Operation(summary = "UserMozziroll 상세 조회", description = "유저모찌롤의 상세 정보를 반환합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "UserMozziroll 상세 정보 조회 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "401", description = "UnAuthorized", content = @Content(examples = {
            @ExampleObject(name = "UnAuthorized", description = "User Mozziroll의 주인이 아니여서 권한이 없음", value = SwaggerConfig.RES_UnAuthorized),
            @ExampleObject(name = "InvalidAccessToken", description = "유효하지 않는 Access Token", value = SwaggerConfig.RES_InvalidAccessToken)
        })),
        @ApiResponse(responseCode = "404", description = "Not Found", content = @Content(examples = {
            @ExampleObject(name = "UserIdNotExistsException", description = "존재하지 않는 User Id", value = SwaggerConfig.RES_UserIdNotExists),
            @ExampleObject(name = "MozzirollNotExists", description = "Mozziroll Not Exists", value = SwaggerConfig.RES_MozzirollNotExists)
        })),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @GetMapping("/{userMozzirollId}")
    public ResponseEntity<? extends BaseResponseBody<UserMozzirollDetailGetRes>> getDetailUserMozziroll(
        @RequestHeader(value = "Authorization", required = false) String accessToken,
        @PathVariable("userMozzirollId") long userMozzirollId) {
        return ResponseEntity.ok()
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<UserMozzirollDetailGetRes>builder()
                    .message("detail UserMozziroll")
                    .data(mozzirollService.getDetailUserMozziroll(accessToken, userMozzirollId))
                    .build()
            );
    }
}
