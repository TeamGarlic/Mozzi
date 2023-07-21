package com.ssafy.life4cut.db.entity.remote;

import java.util.Objects;

import org.hibernate.annotations.ColumnDefault;

import com.ssafy.life4cut.db.entity.BaseEntity;

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
public class FrameClip extends BaseEntity {
    private double width;
    private double height;
    private double x;
    private double y;

    @ManyToOne
    @JoinColumn(name = "frameId")
    private Frame frame;

    @ColumnDefault("false")
    private boolean deleted;

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), super.getId());
    }
}
