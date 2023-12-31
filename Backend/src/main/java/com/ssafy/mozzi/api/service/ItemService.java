package com.ssafy.mozzi.api.service;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.mozzi.api.request.BackgroundFavoritePostReq;
import com.ssafy.mozzi.api.response.BackgroundFavoritePostRes;
import com.ssafy.mozzi.api.response.FrameListGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundGetRes;
import com.ssafy.mozzi.api.response.ItemBackgroundPostRes;
import com.ssafy.mozzi.api.response.ItemStickerGetRes;
import com.ssafy.mozzi.common.dto.FrameClipItem;

/**
 *  Item 요청에 대한 Service/비즈니스 로직 인터페이스
 *
 * @see ItemServiceImpl
 */
public interface ItemService {
    ItemBackgroundGetRes getBackgroundRes(String authorization, int pageNum, int pageSize, boolean isFavorite);

    FrameListGetRes getFrameList();

    ItemStickerGetRes getStickerRes(int pageNum, int pageSize);

    ItemBackgroundPostRes saveBackground(MultipartFile file, String title);

    String saveFrame(MultipartFile file, String title);

    String saveFrameClips(long frameId, FrameClipItem[] frameClipItems);

    BackgroundFavoritePostRes saveFavoriteBackground(BackgroundFavoritePostReq backgroundFavoritePostReq,
        String accessToken);
}
