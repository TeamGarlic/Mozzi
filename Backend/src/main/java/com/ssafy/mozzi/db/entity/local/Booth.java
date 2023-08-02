package com.ssafy.mozzi.db.entity.local;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Booth extends BaseEntity {

    /**
     * Openvidu 연결에 사용되는 Session 값
     */
    @NotNull
    @Size(max = 20)
    @Column(name = "session_id", unique = true)
    private String sessionId;

    @NotNull
    @Size(max = 20)
    @Column(name = "share_code", unique = true)
    private String shareCode;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private long creator;

    @Column
    @OneToMany(mappedBy = "booth", orphanRemoval = true, cascade = CascadeType.ALL)
    private Set<BoothUser> users;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Booth booth))
            return false;
        if (!super.equals(o))
            return false;
        return Objects.equals(getId(), booth.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
