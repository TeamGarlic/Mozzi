package com.ssafy.mozzi.db.entity.remote;

import java.util.Objects;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import com.ssafy.mozzi.db.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "user_mozziroll",
    uniqueConstraints = {@UniqueConstraint(name = "usermozzi", columnNames = {"user_id", "mozziroll_id"})})
@SQLDelete(sql = "UPDATE user_mozziroll SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class UserMozziroll extends BaseEntity {

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean deleted = false;

    @Size(max = 100)
    private String title = "default title";

    @Builder.Default
    @ColumnDefault("false")
    @Column(nullable = false)
    private Boolean posted = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne
    @JoinColumn(name = "mozziroll_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Mozziroll mozziroll;
    // @OneToMany(mappedBy = "likedUserMozziroll", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<MozzirollLike> likedUsers = new ArrayList<>();

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
