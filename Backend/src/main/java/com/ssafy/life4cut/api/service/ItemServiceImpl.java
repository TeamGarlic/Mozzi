package com.ssafy.life4cut.api.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.life4cut.api.response.ItemBackgroundGetRes;
import com.ssafy.life4cut.api.response.ItemStickerGetRes;
import com.ssafy.life4cut.common.util.mapper.ItemMapper;
import com.ssafy.life4cut.db.datasource.LocalDatasource;
import com.ssafy.life4cut.db.entity.remote.Backgroud;
import com.ssafy.life4cut.db.entity.remote.Sticker;
import com.ssafy.life4cut.db.repository.remote.BackgroundRepository;
import com.ssafy.life4cut.db.repository.remote.StickerRepository;

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
    private final StickerRepository stickerRepository;

    /**
     * Background Get 요청에 대한 응답을 반환하는 비즈니스 로직
     * @param pageNum int
     * @param pageSize int
     * @return ItemBackgroundGetRes
     * @see ItemBackgroundGetRes
     * @see Backgroud
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public ItemBackgroundGetRes getBackgroundRes(int pageNum, int pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);  // Page 객체를 갖고오기 위한 PageRequest 객체 생성
        Page<Backgroud> page = backgroundRepository.findAll(pageRequest);  // Page 객체 생성
        List<Backgroud> backgrounds = page.getContent();  // Page 의 Method 를 이용하여 Background 객체들의 리스트를 만듦

        return ItemMapper.toItemBackgroundGetRes(backgrounds, page.getTotalPages());
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
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public ItemStickerGetRes getStickerRes(int pageNum, int pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);  // Page 객체를 갖고오기 위한 PageRequest 객체 생성
        Page<Sticker> page = stickerRepository.findAll(pageRequest);  // Page 객체 생성
        List<Sticker> stickers = page.getContent();  // Page 의 Method 를 이용하여 Background 객체들의 리스트를 만듦

        return ItemMapper.toItemStickerGetRes(stickers, page.getTotalPages());
    }
}
