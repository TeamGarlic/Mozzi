package com.ssafy.mozzi.db.repository.local;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.db.entity.local.Booth;
import com.ssafy.mozzi.db.entity.local.BoothUser;

/**
 * 부스 유저 관련 JPA Query Method 인터페이스
 *
 * @see Booth
 */
@Repository
public interface BoothUserRepository extends JpaRepository<BoothUser, Long> {
    List<BoothUser> findByBoothId(long boothId);
    Optional<BoothUser> findByBoothIdAndUserId(long BooothId, long userId);

    Long deleteByBoothId(long BoothId);
}
