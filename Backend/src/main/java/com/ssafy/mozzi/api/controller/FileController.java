package com.ssafy.mozzi.api.controller;

import java.nio.charset.StandardCharsets;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.api.service.FileService;
import com.ssafy.mozzi.common.dto.ObjectFileItem;
import com.ssafy.mozzi.common.model.APICacheControl;
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
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "Oracle 컨트롤러", description = "Oracle Cloud File 관리 컨트롤러")
public class FileController {
    private final FileService fileService;

    /**
     * 모찌롤 파일을 ObjectStorage에 저장 및 방장의 마이페이지에 추가
     *
     * @param accessToken String
     * @param file MultipartFile
     * @return ResponseEntity<? extends ItemBackgroundGetRes>
     * @see FileService
     */
    @Operation(summary = "모찌롤 업로드", description = "방장에게 파일을 받아 Oracle Cloud에 모찌롤을 업로드 합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "업로드 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "404", description = "User Id 존재 X",
            content = @Content(schema = @Schema(ref = "#/components/schemas/UserIdNotExists"))),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @PostMapping(value = "/mozziroll/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<? extends BaseResponseBody<FileMozzirollPostRes>> saveMozziroll(
        @RequestHeader("Authorization") String accessToken, @RequestParam("file") MultipartFile file,
        @RequestParam("title") String title) {

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(APICacheControl.noCache)
            .body(
                BaseResponseBody.<FileMozzirollPostRes>builder()
                    .message("Save mozziroll success")
                    .data(fileService.saveMozziroll(file, title, accessToken))
                    .build()
            );
    }

    /**
     * 모찌롤 id에 해당하는 모찌롤을 다운로드
     *
     * @param mozzirollId String
     * @return ResponseEntity<Resource>
     * @see FileService
     * @see ObjectFileItem
     * @see MediaType
     */
    @Operation(summary = "모찌롤 다운로드", description = "모찌롤 id에 해당하는 모찌롤을 다운 받습니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "모찌롤 다운로드 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @GetMapping(value = "/mozziroll/{mozzirollId}")
    public ResponseEntity<Resource> downloadMozziroll(@PathVariable("mozzirollId") String mozzirollId) {
        ObjectFileItem objectFileItem = fileService.downloadMozziroll(mozzirollId);

        return ResponseEntity
            .status(HttpStatus.OK)
            .cacheControl(APICacheControl.usePrivateCache)
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment() // (6)
                .filename(objectFileItem.getFileName(), StandardCharsets.UTF_8)
                .build()
                .toString())
            .body(objectFileItem.getFile());
    }

    /**
     * ObjectName으로 resource(이미지, 영상) 반환하는 메소드
     *
     * @param objectName String
     * @return ResponseEntity<Resource>
     * @see FileService
     */
    @Operation(summary = "파일 다운로드", description = "Object name을 이용하여 파일을 다운 받습니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "파일 다운로드 성공", useReturnTypeSchema = true),
        @ApiResponse(responseCode = "500", description = "서버 에러",
            content = @Content(schema = @Schema(ref = "#/components/schemas/InternalError")))
    })
    @GetMapping(value = "/object/{objectName}")
    public ResponseEntity<Resource> getObject(
        @PathVariable("objectName") String objectName) {
        Resource resource = fileService.getObject(objectName);

        return ResponseEntity.ok()
            .cacheControl(APICacheControl.usePrivateCache)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment() // (6)
                .filename(resource.getFilename(), StandardCharsets.UTF_8)
                .build()
                .toString())
            .body(resource);
    }
}