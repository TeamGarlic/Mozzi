package com.ssafy.life4cut.db.entity.remote;

import java.time.LocalDateTime;
import java.util.Objects;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.proxy.HibernateProxy;

import com.ssafy.life4cut.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 배경 화면 저장및 사용을 위한 Entity
 */
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Backgroud extends BaseEntity {
    @Size(max = 300)
    private String url;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean deleted = false;

    @Override
    public final boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null)
            return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ?
            ((HibernateProxy)o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ?
            ((HibernateProxy)this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass)
            return false;
        Backgroud backgroud = (Backgroud)o;
        return getId() != null && Objects.equals(getId(), backgroud.getId());
    }

    @Override
    public final int hashCode() {
        return getClass().hashCode();
    }
}
