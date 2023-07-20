package com.ssafy.life4cut.db.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 프레임 저장 및 사용을 위한 Entity
 * @see FrameClip
 */
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Frame extends BaseEntity{
    @Column(length = 500)
    private String url;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private boolean deleted = false;

    @OneToMany(mappedBy = "frame", fetch = FetchType.EAGER)
    private Set<FrameClip> frameClips = new HashSet<>();
}
