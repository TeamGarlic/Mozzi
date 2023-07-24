package com.ssafy.life4cut.db.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.life4cut.db.entity.local.Booth;

/**
 * 부스 모델 관련 JPA Query Method 인터페이스
 *
 * @see Booth
 */
@Repository
public interface BoothRepository extends JpaRepository<Booth, Long> {
    Booth findByShareCode(String shareCode);

    Booth findBySessionId(String sessionId);
}