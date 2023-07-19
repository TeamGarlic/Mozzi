package com.ssafy.life4cut.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.life4cut.db.entity.User;

/**
 * 유저 모델 관련 JPA Query Method 인터페이스
 *
 * @see User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}