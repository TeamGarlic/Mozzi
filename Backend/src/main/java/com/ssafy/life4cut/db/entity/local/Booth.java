package com.ssafy.life4cut.db.entity.local;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.ssafy.life4cut.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Booth extends BaseEntity {

    /**
     * Openvidu 연결에 사용되는 Session 값
     */
    @Column(unique = true)
    private String sessionId;

    @Column(unique = true)
    private String shareCode;

    @CreationTimestamp
    private LocalDateTime createAt;
}
