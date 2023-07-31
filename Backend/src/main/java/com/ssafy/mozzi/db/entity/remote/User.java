package com.ssafy.mozzi.db.entity.remote;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User JPA Entity(Model)
 *
 * @see Mozzilol
 */
@SuppressWarnings("checkstyle:RegexpMultiline")
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseEntity {

    @NotNull
    @Size(max = 16)
    @Column(name = "user_id", unique = true)
    private String userId;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotNull
    @Size(max = 73)
    private String password;

    @NotNull
    @Size(max = 16)
    private String nickname;

    @Size(max = 32)
    private String email;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean deleted = false;

    @OneToMany(mappedBy = "user")
    private Set<UserMozzilol> userMozzilols = new HashSet<>();

    @OneToMany(mappedBy = "likedUser")
    private Set<MozzilolLike> likedMozzilols = new HashSet<>();

    @Size(max = 150)
    private String refreshToken;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof User user))
            return false;
        if (!super.equals(o))
            return false;
        return Objects.equals(getId(), user.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}