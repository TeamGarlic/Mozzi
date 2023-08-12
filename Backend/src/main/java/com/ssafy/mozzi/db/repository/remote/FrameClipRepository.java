package com.ssafy.mozzi.db.repository.remote;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.mozzi.db.entity.remote.FrameClip;

/**
 *  프레임의 클립 모델 관련 JPA Query Method 인터페이스
 *
 * @see FrameClip
 */
public interface FrameClipRepository extends JpaRepository<FrameClip, Long> {
}
