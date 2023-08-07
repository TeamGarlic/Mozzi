package com.ssafy.mozzi.db.entity.remote;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@SQLDelete(sql = "UPDATE mozziroll SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class Mozziroll extends BaseEntity {

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

    @OneToMany(mappedBy = "mozziroll")
    private Set<UserMozziroll> userMozzirolls = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Mozziroll mozziroll))
            return false;
        if (!super.equals(o))
            return false;
        return Objects.equals(getId(), mozziroll.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
