package com.ssafy.life4cut.db.entity.remote;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.ssafy.life4cut.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자가 만든 클립을 저장및 사용을 위한 Entity
 * @see User
 */
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Clip extends BaseEntity {

    @NotNull
    @Size(max = 500)
    private String url;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean deleted = false;

    @ManyToMany(mappedBy = "clips")
    private Set<User> users = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Clip clip))
            return false;
        if (!super.equals(o))
            return false;
        return Objects.equals(getId(), clip.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
