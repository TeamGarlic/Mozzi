package com.ssafy.mozzi.db.entity.remote;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotNull
    @Size(max = 500)
    @Column(name = "object_name")
    private String objectName;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean deleted = false;

    @Fetch(FetchMode.SUBSELECT)
    @OneToMany(mappedBy = "frame", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<FrameClip> frameClips = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Frame frame))
            return false;
        if (!super.equals(o))
            return false;
        return Objects.equals(getId(), frame.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
