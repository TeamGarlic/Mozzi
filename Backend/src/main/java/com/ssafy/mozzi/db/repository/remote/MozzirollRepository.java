package com.ssafy.mozzi.db.repository.remote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.db.entity.remote.Mozziroll;

/**
 * 배경 모델 관련 JPA Query Method 인터페이스
 *
 * @see Repository
 */
@Repository
public interface MozzirollRepository extends JpaRepository<Mozziroll, Long> {
}