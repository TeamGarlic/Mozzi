package com.ssafy.mozzi.db.entity.local;

import com.ssafy.mozzi.db.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@Entity
@NoArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"booth_id", "user_id"})})
public class BoothUser extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "booth_id")
    private Booth booth;

    @Column(name = "user_id")
    private long userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        BoothUser boothUser = (BoothUser) o;
        return userId == boothUser.userId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), userId);
    }
}
