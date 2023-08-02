package com.ssafy.mozzi.db.repository.local;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.db.entity.local.BoothUser;

@Repository
public interface BoothUserRepository extends JpaRepository<BoothUser, Long> {
    Optional<BoothUser> findByBoothIdAndUserId(long BooothId, long userId);
}
