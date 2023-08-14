package com.ssafy.mozzi.db.repository.remote;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.common.dto.UserMozzirollItemDto;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;

/**
 * 배경 모델 관련 JPA Query Method 인터페이스
 *
 * @see Repository
 */
@Repository
public interface UserMozzirollRepository extends JpaRepository<UserMozziroll, Long> {
    Optional<UserMozziroll> findByMozzirollIdAndUserId(long mozzirollId, long userId);

    // TODO: 쿼리 개선 생각
    @Query("""
            select userMozziroll.id as id, 
            userMozziroll.title as title, 
            userMozziroll.posted as posted, 
            userMozziroll.user as user, 
            userMozziroll.mozziroll as mozziroll, 
            count(like.likedUserMozziroll.id) as likeCount, 
            CASE WHEN EXISTS (SELECT likedUser.id FROM MozzirollLike likedUser WHERE likedUser.likedUser.id = :userId AND likedUser.likedUserMozziroll.id=userMozziroll.id) THEN true 
            ELSE false 
            END AS isLiked 
            from UserMozziroll userMozziroll left join MozzirollLike as like on userMozziroll.id = like.likedUserMozziroll.id 
            where userMozziroll.deleted = false and userMozziroll.user.id=:userId 
            group by userMozziroll.id
            order by userMozziroll.id desc
        """)
    Page<UserMozzirollItemDto> findByUserId(@Param("userId") Long userId, Pageable pageable);

    Optional<UserMozziroll> findByIdAndUserId(long id, long userId);

    // 좋아요/id(time) 순으로 정렬하고 삭제 되지 않고 post 하기로 설정한 게시물만 가져옵니다.
    @Query("""
            select userMozziroll.id as id, 
            userMozziroll.title as title, 
            userMozziroll.posted as posted, 
            userMozziroll.user as user, 
            userMozziroll.mozziroll as mozziroll, 
            count(like.likedUserMozziroll.id) as likeCount,
            CASE 
            WHEN :userId=null THEN false 
            WHEN EXISTS (SELECT likedUser.id FROM MozzirollLike likedUser WHERE likedUser.likedUser.id = :userId AND likedUser.likedUserMozziroll.id=userMozziroll.id) THEN true 
            ELSE false END AS isLiked 
            from UserMozziroll userMozziroll left join MozzirollLike as like on userMozziroll.id = like.likedUserMozziroll.id 
            where userMozziroll.deleted = false and userMozziroll.posted 
            group by userMozziroll.id 
            order by 
            CASE 
            WHEN :sorted='like' THEN count(like.likedUserMozziroll.id) END
            desc,
            userMozziroll.id desc
        """)
    Page<UserMozzirollItemDto> findAllOrderByMozzirollLikeCount(@Param("userId") Long userId,
        @Param("sorted") String sorted, Pageable pageable);

    boolean existsByIdAndUser(Long id, User user);

    boolean existsByMozzirollId(Long mozzirollId);

    @Query("""
            select userMozziroll.id as id, 
            userMozziroll.title as title, 
            userMozziroll.posted as posted, 
            userMozziroll.user as user, 
            userMozziroll.mozziroll as mozziroll, 
            (SELECT COUNT(id) FROM MozzirollLike ml WHERE userMozziroll.id=ml.likedUserMozziroll.id) as likeCount, 
            CASE 
            WHEN :userId is not null and EXISTS (SELECT likedUser.id FROM MozzirollLike likedUser WHERE likedUser.likedUser.id = :userId AND likedUser.likedUserMozziroll.id=userMozziroll.id) THEN true 
            ELSE false 
            END AS isLiked 
            from UserMozziroll userMozziroll
            where userMozziroll.id=:id and userMozziroll.deleted=false
        """)
    Optional<UserMozzirollItemDto> findUserMozzirollByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}