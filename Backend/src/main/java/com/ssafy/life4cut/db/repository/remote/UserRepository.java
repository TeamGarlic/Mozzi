package com.ssafy.life4cut.db.repository.remote;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.life4cut.db.entity.remote.User;

/**
 * 유저 모델 관련 JPA Query Method 인터페이스
 *
 * @see User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // userId에 해당하는 객체가 존재하면 반환하고, 그렇지 않으면 null 을 반환
    Optional<User> findByUserId(String userId);
}