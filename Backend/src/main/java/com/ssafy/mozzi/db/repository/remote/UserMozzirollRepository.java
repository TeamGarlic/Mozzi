package com.ssafy.mozzi.db.repository.remote;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    Page<UserMozziroll> findByUserId(Long userId, Pageable pageable);

    // 좋아요 순으로 정렬하고 삭제 되지 않고 post 하기로 설정한 게시물만 가져옵니다.
    // TODO: posted 를 어떻게 설정할지 프론트랑 논의 해봐야됨, default를 true로 할지...
    @Query("select userMozziroll from UserMozziroll "
            + "userMozziroll left join MozzirollLike as like on userMozziroll.id = like.likedUserMozziroll.id "
            + "where userMozziroll.deleted = false and userMozziroll.posted "
            + "group by userMozziroll.id order by count(like.likedUserMozziroll.id) desc")
    Page<UserMozziroll> findAllOrderByMozzirollLikeCount(Pageable pageable);
}