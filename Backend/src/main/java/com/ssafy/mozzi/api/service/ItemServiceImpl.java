package com.ssafy.mozzi.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.oracle.bmc.objectstorage.responses.PutObjectResponse;
import com.ssafy.mozzi.api.request.BackgroundFavoritePostReq;
import com.ssafy.mozzi.api.response.BackgroundFavoritePostRes;
import com.ssafy.mozzi.api.response.FrameListGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundPostRes;
import com.ssafy.mozzi.api.response.ItemStickerGetRes;
import com.ssafy.mozzi.common.auth.ObjectStorageClient;
import com.ssafy.mozzi.common.dto.BackgroundEntityDto;
import com.ssafy.mozzi.common.dto.FrameClipItem;
import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;
import com.ssafy.mozzi.common.exception.handler.BadRequestException;
import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;
import com.ssafy.mozzi.common.exception.handler.NotFoundException;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;
import com.ssafy.mozzi.common.util.FileUtil;
import com.ssafy.mozzi.common.util.MozziUtil;
import com.ssafy.mozzi.common.util.mapper.ItemMapper;
import com.ssafy.mozzi.db.datasource.RemoteDatasource;
import com.ssafy.mozzi.db.entity.remote.Backgroud;
import com.ssafy.mozzi.db.entity.remote.BackgroundFavorite;
import com.ssafy.mozzi.db.entity.remote.Frame;
import com.ssafy.mozzi.db.entity.remote.FrameClip;
import com.ssafy.mozzi.db.entity.remote.Sticker;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.repository.cloud.FileRepository;
import com.ssafy.mozzi.db.repository.remote.BackgroundFavoriteRepository;
import com.ssafy.mozzi.db.repository.remote.BackgroundRepository;
import com.ssafy.mozzi.db.repository.remote.FrameClipRepository;
import com.ssafy.mozzi.db.repository.remote.FrameRepository;
import com.ssafy.mozzi.db.repository.remote.StickerRepository;
import com.ssafy.mozzi.db.repository.remote.UserRepository;

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
    private final FrameClipRepository frameClipRepository;
    private final StickerRepository stickerRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final BackgroundFavoriteRepository backgroundFavoriteRepository;
    private final ObjectStorageClient client;
    private final MozziUtil mozziUtil;

    /**
     * Background Get 요청에 대한 응답을 반환하는 비즈니스 로직
     * @param pageNum int
     * @param pageSize int
     * @return ItemBackgroundGetRes
     * @see ItemBackgroundGetRes
     * @see BackgroundEntityDto
     * @throws UnAuthorizedException (Invalid Access Token, 17)
     * @throws com.ssafy.mozzi.common.exception.handler.NotFoundException (UserIdNotExists, 2)
     */
    @Override
    public ItemBackgroundGetRes getBackgroundRes(String authorization, int pageNum, int pageSize, boolean isFavorite) {
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);  // Page 객체를 갖고오기 위한 PageRequest 객체 생성
        Page<BackgroundEntityDto> page = null;
        if (authorization.isEmpty()) {
            page = backgroundRepository.findAllWithFavorite(pageRequest);
        } else if (isFavorite) {
            Long userId = mozziUtil.findUserIdByToken(authorization);
            page = backgroundRepository.findByUserAllWithFavoriteAndUser(userId, pageRequest);
        } else {
            Long userId = mozziUtil.findUserIdByToken(authorization);
            page = backgroundRepository.findAllWithFavoriteAndUser(userId, pageRequest);
        }

        List<BackgroundEntityDto> backgrounds = page.getContent();  // Page 의 Method 를 이용하여 Background 객체들의 리스트를 만듦

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
        List<Frame> frames = frameRepository.findAllJoinFetch();

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
     * @throws CloudStorageSaveFailException (mozzi code : 0, Http status : 500)
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public ItemBackgroundPostRes saveBackground(MultipartFile file, String title) {
        final String OBJECT_NAME = String.format("%s_%s", System.currentTimeMillis(), file.getOriginalFilename());
        String contentType = "multipart/form-data";

        Backgroud backgroud = backgroundRepository.save(Backgroud.builder()
            .objectName(OBJECT_NAME)
            .title(title)
            .build());

        // Object Storage에 파일 추가
        PutObjectResponse response = fileRepository.putObject(client.getClient(), FileUtil.generateStreamFromFile(file),
            OBJECT_NAME, contentType);

        if (response.getLastModified() == null)
            throw new CloudStorageSaveFailException("Fail to upload background");
        return ItemMapper.toItemBackgroundPostRes(backgroud);
    }

    /**
     * 프레임 업로드 비지니스 로직
     * @param file MultipartFile
     * @param title String
     * @see ItemService
     * @throws CloudStorageSaveFailException (mozzi code : 0, Http status : 500)
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public String saveFrame(MultipartFile file, String title) {
        final String OBJECT_NAME = String.format("%s_%s", System.currentTimeMillis(), file.getOriginalFilename());

        Frame frame = frameRepository.save(Frame.builder()
            .objectName(OBJECT_NAME)
            .title(title)
            .build());
        PutObjectResponse response = fileRepository.putObject(client.getClient(), FileUtil.generateStreamFromFile(file),
            OBJECT_NAME, "multipart/form-data");
        if (response.getLastModified() == null)
            throw new CloudStorageSaveFailException("Fail to upload Frame file");

        return String.valueOf(frame.getId());
    }

    /**
     * 프레임 클립 업로드 비지니스 로직
     * @param frameId long
     * @param frameClipItems FrameClipItem[]
     * @see Frame
     * @see FrameClip
     * @throws NotFoundException (FrameNotExists, 19)
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public String saveFrameClips(long frameId, FrameClipItem[] frameClipItems) {
        Optional<Frame> frameCandidate = frameRepository.findById(frameId);
        if (frameCandidate.isEmpty()) {
            throw new NotFoundException(MozziAPIErrorCode.FrameNotExists, "Requested Frame Not Exists");
        }

        Frame frame = frameCandidate.get();

        List<FrameClip> frameClips = frame.getFrameClips();

        for (FrameClipItem frameClipItem : frameClipItems) {
            FrameClip frameClip = frameClipRepository.save(
                FrameClip.builder()
                    .width(frameClipItem.getWidth())
                    .height(frameClipItem.getHeight())
                    .x(frameClipItem.getX())
                    .y(frameClipItem.getY())
                    .build());

            frameClip.setFrame(frame);
            frameClips.add(frameClip);
        }

        frame.setFrameClips(frameClips);
        frameRepository.save(frame);

        return "success";
    }

    /**
     * Background 즐겨찾기 등록의 비즈니스 로직
     * @param backgroundFavoritePostReq FavoriteBackgroundPostReq
     * @param accessToken String
     * @see UserRepository
     * @see BackgroundRepository
     * @see BackgroundFavoriteRepository
     * @see ItemMapper
     * @throws BadRequestException (NoData, 13)
     * @throws UnAuthorizedException (UnAuthorized, 11) (Invalid Access Token, 17)
     * @throws com.ssafy.mozzi.common.exception.handler.NotFoundException (UserIdNotExists, 2)
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public BackgroundFavoritePostRes saveFavoriteBackground(BackgroundFavoritePostReq backgroundFavoritePostReq,
        String accessToken) {
        long userId = mozziUtil.findUserIdByToken(accessToken);
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new UnAuthorizedException(MozziAPIErrorCode.UnAuthorized,
                "You are not authorized to save favorite-background");
        }
        Optional<Backgroud> backgroud = backgroundRepository.findById(backgroundFavoritePostReq.getBackgroundId());
        if (backgroud.isEmpty()) {
            throw new BadRequestException(MozziAPIErrorCode.NoData, "This is no data for save favorite-background");
        }

        Optional<BackgroundFavorite> backgroundFavorite = backgroundFavoriteRepository.findByUserAndBackground(
            user.get(),
            backgroud.get());

        boolean favorite = false;
        if (backgroundFavorite.isPresent()) {
            backgroundFavoriteRepository.delete(backgroundFavorite.get());
        } else {
            backgroundFavorite = Optional.of(backgroundFavoriteRepository.save(BackgroundFavorite.builder()
                .background(backgroud.get())
                .user(user.get())
                .build()));
            favorite = true;
        }

        return ItemMapper.toBackgroundFavoritePostRes(backgroundFavorite.get(), favorite);
    }
}
