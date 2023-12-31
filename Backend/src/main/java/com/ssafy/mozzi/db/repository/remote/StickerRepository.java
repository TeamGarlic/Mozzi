package com.ssafy.mozzi.db.repository.remote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.db.entity.remote.Sticker;

/**
 * 스티커 모델 관련 JPA Query Method 인터페이스
 * @see Sticker
 */
@Repository
public interface StickerRepository extends JpaRepository<Sticker, Long> {
}
