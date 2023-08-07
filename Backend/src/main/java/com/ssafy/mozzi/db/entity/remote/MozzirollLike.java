package com.ssafy.mozzi.db.entity.remote;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "mozziroll_like")
@SQLDelete(sql = "UPDATE mozziroll_like SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class MozzirollLike extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "liked_user_id")
    private User likedUser;

    @ManyToOne
    @JoinColumn(name = "user_mozziroll_id")
    private UserMozziroll likedUserMozziroll;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean deleted = false;
}
