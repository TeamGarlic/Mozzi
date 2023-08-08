package com.ssafy.mozzi.db.repository.remote;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.mozzi.db.entity.remote.Backgroud;
import com.ssafy.mozzi.db.entity.remote.BackgroundEntityDto;

/**
 * 배경 즐겨찾기 모델 관련 JPA Query Method 인터페이스
 *
 * @see Repository
 */
@Repository
public interface BackgroundRepository extends JpaRepository<Backgroud, Long> {
    @Query("SELECT b.id as id,b.objectName as objectName,b.title as title, bf.id as favoriteId FROM Backgroud b LEFT JOIN BackgroundFavorite bf ON b.id=bf.background.id AND bf.user.id=:userId")
    Page<BackgroundEntityDto> findAllWithFavorite(@Param("userId") Long userId, Pageable pageable);
}