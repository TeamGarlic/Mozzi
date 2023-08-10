package com.ssafy.mozzi.db.entity.local;

import java.util.Objects;

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
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"booth_id", "user_id"})})
public class BoothUser extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "booth_id")
    private Booth booth;

    @Column(name = "user_id")
    private long userId;

    @Override
    public boolean equals(Object o) {
        if (Objects.equals(this, o)) {
            return true;
        }
        if (!(o instanceof BoothUser boothUser)) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        return Objects.equals(getId(), boothUser.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), userId);
    }
}
