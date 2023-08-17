package com.ssafy.mozzi.db.entity.remote;

import java.time.LocalDateTime;
import java.util.Objects;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "mozziroll_like", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"liked_user_id", "user_mozziroll_id"})
})
public class MozzirollLike extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "liked_user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User likedUser;

    @ManyToOne
    @JoinColumn(name = "user_mozziroll_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserMozziroll likedUserMozziroll;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof MozzirollLike mozzirollLike))
            return false;
        if (!super.equals(o))
            return false;
        return Objects.equals(getId(), mozzirollLike.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
