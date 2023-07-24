package com.ssafy.life4cut.db.entity.remote;

import java.util.Objects;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.proxy.HibernateProxy;

import com.ssafy.life4cut.db.entity.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 프레임에 대한 클립 위치 정보를 위한 Entity
 * @see Frame
 */
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FrameClip extends BaseEntity {
    private double width;
    private double height;
    private double x;
    private double y;

    @ManyToOne
    @JoinColumn(name = "frameId")
    private Frame frame;

    @ColumnDefault("false")
    private boolean deleted;

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
        FrameClip frameClip = (FrameClip)o;
        return getId() != null && Objects.equals(getId(), frameClip.getId());
    }

    @Override
    public final int hashCode() {
        return getClass().hashCode();
    }
}
