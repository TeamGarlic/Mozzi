package com.ssafy.mozzi.db.entity.remote;

import java.time.LocalDateTime;
import java.util.Objects;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "frame_clip")
public class FrameClip extends BaseEntity {
    @NotNull
    private double width;

    @NotNull
    private double height;

    @NotNull
    private double x;

    @NotNull
    private double y;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "frame_id")
    private Frame frame;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof FrameClip frameClip))
            return false;
        if (!super.equals(o))
            return false;
        return Objects.equals(getId(), frameClip.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
