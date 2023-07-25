package com.ssafy.life4cut.db.entity.local;

import java.time.LocalDateTime;
import java.util.Objects;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.proxy.HibernateProxy;

import com.ssafy.life4cut.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    @Column(unique = true)
    private String sessionId;

    @Column(unique = true)
    private String shareCode;

    @CreationTimestamp
    private LocalDateTime createAt;

    @Column(nullable = false)
    private long creator;

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
        Booth booth = (Booth)o;
        return getId() != null && Objects.equals(getId(), booth.getId());
    }

    @Override
    public final int hashCode() {
        return getClass().hashCode();
    }
}
