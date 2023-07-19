package com.ssafy.life4cut.db.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 프레임에 대한 클립 위치 정보를 위한 Entity
 * @see Frame
 */
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FrameClip extends BaseEntity{
    private int width;
    private  int height;
    private int x;
    private int y;

    @ManyToOne
    @JoinColumn(name = "frame_id")
    private Frame frame;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private boolean deleted = false;
}
