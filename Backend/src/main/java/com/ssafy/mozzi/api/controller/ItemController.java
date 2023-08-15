package com.ssafy.mozzi.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.request.BackgroundFavoritePostReq;
import com.ssafy.mozzi.api.response.BackgroundFavoritePostRes;
import com.ssafy.mozzi.api.response.FrameListGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundPostRes;
import com.ssafy.mozzi.api.response.ItemStickerGetRes;
import com.ssafy.mozzi.api.service.ItemService;
import com.ssafy.mozzi.common.dto.FrameClipItem;
import com.ssafy.mozzi.common.model.APICacheControl;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Item 관련 API 요청을 위한 Controller
 */
@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/items")
@Tag(name = "Item 컨트롤러", description = "Mozzi에서 사용되는 프레임, 배경 화면 등을 관리하는 컨트롤러입니다.")
public class ItemController {
    private final ItemService itemService;

    /**
     * 배경 화면/즐겨찾기 배경 화면 GET 응답을 위한 메소드
     *
     * @param pageNum int
     * @param pageSize int
     * @param isFavorite boolean, false: 전체 배경 리스트/true:유저가 즐겨찾기한 배경 리스트
     * @return ResponseEntity<? extends ItemBackgroundGetRes>
     * @see ItemService
     */
    @Operation(summary = "배경 화면 가져오기", description = "배경 화면을 페이징 처리 하여 기져오기.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "배경 화면 fetch 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "401", description = "Invalid Access Token", content = @Content(schema = @Schema(ref = "#/components/schemas/InvalidAccessToken"))),
        @ApiResponse(responseCode = "404", description = "존재하지 않는 User Id", content = @Content(schema = @Schema(ref = "#/components/schemas/UserIdNotExists"))),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @GetMapping("/backgrounds")
    public ResponseEntity<? extends BaseResponseBody<ItemBackgroundGetRes>> getBackgrounds(
        @RequestHeader(required = false, defaultValue = "") String authorization,
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
        @RequestParam(value = "isFavorite", defaultValue = "false") boolean isFavorite) {

        return ResponseEntity.ok()
            .cacheControl(APICacheControl.noCache)
            .body(BaseResponseBody.<ItemBackgroundGetRes>builder()
                .message((isFavorite ? "My" : "All") + " Background list. pageNum: " + pageNum)
                .data(itemService.getBackgroundRes(authorization, pageNum, pageSize, isFavorite))
                .build()
            );
    }

    /**
     * 스티커 GET 응답을 위한 메소드
     *
     * @param pageNum int
     * @param pageSize int
     * @return ResponseEntity<? extends ItemStickerGetRes>
     * @see ItemService
     */
    @Operation(summary = "스티커 가져오기", description = "스티커를 페이징 처리 하여 기져오기.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "스티커 fetch 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @GetMapping("/stickers")
    public ResponseEntity<? extends BaseResponseBody<ItemStickerGetRes>> getStickers(
        @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        return ResponseEntity.ok()
            .cacheControl(APICacheControl.usePublicCache)
            .body(
                BaseResponseBody.<ItemStickerGetRes>builder()
                    .message("sticker list page " + pageNum)
                    .data(itemService.getStickerRes(pageNum, pageSize))
                    .build()
            );
    }

    /**
     * 프레임 리스트 GET 응답을 위한 메소드
     *
     * @return ResponseEntity<? extends BaseResponseBody>
     * @see ItemService
     */
    @Operation(summary = "프레임 가져오기", description = "프레임을 페이징 처리 하여 기져오기.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "프레임 fetch 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @GetMapping("/frames")
    public ResponseEntity<? extends BaseResponseBody<FrameListGetRes>> getFrames() {

        return ResponseEntity.ok()
            .cacheControl(APICacheControl.usePublicCache)
            .body(
                BaseResponseBody.<FrameListGetRes>builder()
                    .message("frame list success")
                    .data(itemService.getFrameList())
                    .build()
            );
    }

    /**
     * 가상 배경 업로드
     *
     * @param file MultipartFile
     * @return ResponseEntity<? extends BaseResponseBody < ItemBackgroundPostRes>>
     * @see ItemService
     */
    @Operation(summary = "가상 배경 업로드", description = "가상 배경을 업로드 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "가상 배경 업로드 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @PostMapping(value = "/background", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<? extends BaseResponseBody<ItemBackgroundPostRes>> saveBackground(
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title) {

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<ItemBackgroundPostRes>builder()
                    .message("Save background success")
                    .data(itemService.saveBackground(file, title))
                    .build()
            );
    }

    /**
     * 프레임 업로드
     * @param file MultipartFile
     * @param title String
     * @see ItemService
     */
    @Operation(summary = "프레임 업로드", description = "프레임을 업로드 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "프레임 업로드 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @PostMapping(value = "/frame", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<? extends BaseResponseBody<String>> saveFrame(
        @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title) {

        String response = itemService.saveFrame(file, title);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<String>builder()
                    .message("frame upload success")
                    .data(response)
                    .build()
            );
    }

    /**
     * 프레임 클립 업로드
     * @param frameId long
     * @param frameClipItems FrameClipItem[]
     * @see ItemService
     */
    @Operation(summary = "프레임 클립 업로드", description = "프레임에 속한 클립 정보를 업로드 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "프레임 클립 업로드 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "404", description = "프레임 존재 X", content = @Content(schema = @Schema(ref = "#/components/schemas/FrameNotExists"))),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @PostMapping("/frame/{frameId}")
    public ResponseEntity<? extends BaseResponseBody<String>> saveFrameClips(
        @PathVariable("frameId") long frameId,
        @RequestBody FrameClipItem[] frameClipItems) {

        String response = itemService.saveFrameClips(frameId, frameClipItems);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<String>builder()
                    .message("frame upload success")
                    .data(response)
                    .build());
    }

    /**
     * 배경 즐겨찾기 추가
     * @param authorization String
     * @param backgroundFavoritePostReq BackgroundFavoritePostReq
     * @see ItemService
     */
    @Operation(summary = "배경 즐겨찾기 추가", description = "선택한 배경을 즐겨찾기 추가합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "배경 즐겨찾기 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "400", description = "즐겨찾기할 정보 없음", content = @Content(schema = @Schema(ref = "#/components/schemas/NoData"))),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @PostMapping("/background/favorite")
    public ResponseEntity<? extends BaseResponseBody<BackgroundFavoritePostRes>> saveFavoriteBackground(
        @RequestHeader String authorization,
        @RequestBody BackgroundFavoritePostReq backgroundFavoritePostReq) {

        return ResponseEntity
            .status(HttpStatus.OK)
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<BackgroundFavoritePostRes>builder()
                    .message("background favorite success")
                    .data(itemService.saveFavoriteBackground(backgroundFavoritePostReq, authorization))
                    .build());
    }
}
