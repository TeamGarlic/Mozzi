package com.ssafy.mozzi.db.repository.remote;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.db.entity.remote.MozzirollLike;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;

/**
 * 모찌롤 좋아요 관련된 Repository
 *
 * @see Repository
 */
@Repository
public interface MozzirollLikeRepository extends JpaRepository<MozzirollLike, Long> {
    Set<MozzirollLike> findByLikedUserAndLikedUserMozziroll(User user, UserMozziroll userMozziroll);
}
