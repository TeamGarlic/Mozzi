package com.ssafy.life4cut.db.entity.remote;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.ssafy.life4cut.db.entity.BaseEntity;

import jakarta.persistence.CascadeType;
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
public class Frame extends BaseEntity {
    @Column(length = 500)
    private String url;

    @CreationTimestamp
    @Column(updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @ColumnDefault("false")
    private boolean deleted;

    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(mappedBy = "frame", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<FrameClip> frameClips = new HashSet<>();

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), super.getId());
    }
}
