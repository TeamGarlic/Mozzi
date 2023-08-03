package com.ssafy.mozzi.db.repository.remote;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.db.entity.remote.UserMozziroll;

/**
 * 배경 모델 관련 JPA Query Method 인터페이스
 *
 * @see Repository
 */
@Repository
public interface UserMozzirollRepository extends JpaRepository<UserMozziroll, Long> {
    Optional<UserMozziroll> findByMozzirollIdAndUserId(long mozzirollId, long userId);
}