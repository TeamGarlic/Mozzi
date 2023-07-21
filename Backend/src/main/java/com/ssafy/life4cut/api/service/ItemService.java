package com.ssafy.life4cut.api.service;

import com.ssafy.life4cut.api.response.FrameListGetRes;
import com.ssafy.life4cut.api.response.ItemBackgroundGetRes;
import com.ssafy.life4cut.api.response.ItemStickerGetRes;

/**
 *  Item 요청에 대한 Service/비즈니스 로직 인터페이스
 *
 * @see ItemServiceImpl
 */
public interface ItemService {
    ItemBackgroundGetRes getBackgroundRes(int pageNum, int pageSize);

    FrameListGetRes getFrameList();

    ItemStickerGetRes getStickerRes(int pageNum, int pageSize);
}
