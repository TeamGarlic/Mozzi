package com.ssafy.mozzi.db.entity.remote;

import java.time.LocalDateTime;
import java.util.Objects;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 스티커 저장 및 사용을 위한 Entity
 */
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE sticker SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class Sticker extends BaseEntity {

    @NotNull
    @Size(max = 500)
    @Column(name = "object_name")
    private String objectName;

    @Size(max = 20)
    private String title = "fault title";

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean deleted = false;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Sticker sticker))
            return false;
        if (!super.equals(o))
            return false;
        return Objects.equals(getId(), sticker.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
