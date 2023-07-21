package com.ssafy.life4cut.db.repository.remote;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.life4cut.db.entity.remote.Frame;

/**
 *  프레임 모델 관련 JPA Query Method 인터페이스
 *
 * @see Frame
 */
public interface FrameRepository extends JpaRepository<Frame, Long> {
    // N+1 문제를 해결하기 위한 JOIN FETCH
    @Query("SELECT frame FROM Frame frame JOIN FETCH frame.frameClips")
    List<Frame> findAllJoinFetch();
}
