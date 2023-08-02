package com.ssafy.mozzi.api.service;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.oracle.bmc.objectstorage.responses.PutObjectResponse;
import com.ssafy.mozzi.api.response.FrameListGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundPostRes;
import com.ssafy.mozzi.api.response.ItemStickerGetRes;
import com.ssafy.mozzi.common.auth.ObjectStorageClient;
import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;
import com.ssafy.mozzi.common.util.FileUtil;
import com.ssafy.mozzi.common.util.mapper.ItemMapper;
import com.ssafy.mozzi.db.datasource.RemoteDatasource;
import com.ssafy.mozzi.db.entity.remote.Backgroud;
import com.ssafy.mozzi.db.entity.remote.Frame;
import com.ssafy.mozzi.db.entity.remote.Sticker;
import com.ssafy.mozzi.db.repository.cloud.FileRepository;
import com.ssafy.mozzi.db.repository.remote.BackgroundRepository;
import com.ssafy.mozzi.db.repository.remote.FrameRepository;
import com.ssafy.mozzi.db.repository.remote.StickerRepository;

import lombok.RequiredArgsConstructor;

/**
 * Item 요청에 대한 비즈니스 로직 구현
 *
 * @see BackgroundRepository
 */
@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final BackgroundRepository backgroundRepository;
    private final FrameRepository frameRepository;
    private final StickerRepository stickerRepository;
    private final FileRepository fileRepository;
    private final ObjectStorageClient client;

    /**
     * Background Get 요청에 대한 응답을 반환하는 비즈니스 로직
     * @param pageNum int
     * @param pageSize int
     * @return ItemBackgroundGetRes
     * @see ItemBackgroundGetRes
     * @see Backgroud
     */
    @Override
    public ItemBackgroundGetRes getBackgroundRes(int pageNum, int pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);  // Page 객체를 갖고오기 위한 PageRequest 객체 생성
        Page<Backgroud> page = backgroundRepository.findAll(pageRequest);  // Page 객체 생성
        List<Backgroud> backgrounds = page.getContent();  // Page 의 Method 를 이용하여 Background 객체들의 리스트를 만듦

        return ItemMapper.toItemBackgroundGetRes(backgrounds, page.getTotalPages());
    }

    /**
     * Frame List Get 요청에 대한 응답을 반환하는 비즈니스 로직
     * @return FrameListGetRes
     * @see Frame
     * @see com.ssafy.mozzi.db.entity.remote.FrameClip
     */
    @Override
    public FrameListGetRes getFrameList() {
        Set<Frame> frames = frameRepository.findAllJoinFetch();

        return ItemMapper.toFrameListGetRes(frames);
    }

    /**
     * Sticker Get 요청에 대한 응답을 반환하는 비즈니스 로직
     * @param pageNum int
     * @param pageSize int
     * @return ItemStickerGetRes
     * @see ItemStickerGetRes
     * @see Sticker
     */
    @Override
    public ItemStickerGetRes getStickerRes(int pageNum, int pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);  // Page 객체를 갖고오기 위한 PageRequest 객체 생성
        Page<Sticker> page = stickerRepository.findAll(pageRequest);  // Page 객체 생성
        List<Sticker> stickers = page.getContent();  // Page 의 Method 를 이용하여 Background 객체들의 리스트를 만듦

        return ItemMapper.toItemStickerGetRes(stickers, page.getTotalPages());
    }

    /**
     * Background 이미지 저장하는 비즈니스 로직
     * @param file MultipartFile
     * @return ItemBackgroundPostRes
     * @see ItemBackgroundPostRes
     * @see BackgroundRepository
     * @see FileRepository
     * @see ObjectStorageClient
     * @see ItemMapper
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public ItemBackgroundPostRes saveBackground(MultipartFile file) {
        final String OBJECT_NAME = String.format("%s_%s", System.currentTimeMillis(), file.getOriginalFilename());
        String contentType = "multipart/form-data";

        Backgroud backgroud = backgroundRepository.save(Backgroud.builder()
            .objectName(OBJECT_NAME)
            .build());

        // Object Storage에 파일 추가
        PutObjectResponse response = fileRepository.putObject(client.getClient(), FileUtil.generateStreamFromFile(file),
            OBJECT_NAME, contentType);

        if (response.getLastModified() == null)
            throw new CloudStorageSaveFailException("파일 업로드 실패");
        return ItemMapper.toItemBackgroundPostRes(backgroud);
    }
}
