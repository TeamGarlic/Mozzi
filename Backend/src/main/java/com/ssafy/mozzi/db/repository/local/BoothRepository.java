package com.ssafy.mozzi.db.repository.local;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.db.entity.local.Booth;

/**
 * 부스 모델 관련 JPA Query Method 인터페이스
 *
 * @see Booth
 */
@Repository
public interface BoothRepository extends JpaRepository<Booth, Long> {
    Optional<Booth> findByShareCode(String shareCode);

    Optional<Booth> findBySessionId(String sessionId);
}