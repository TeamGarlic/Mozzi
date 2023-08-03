package com.ssafy.mozzi.db.entity.remote;

import com.ssafy.mozzi.db.entity.BaseEntity;

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
public class MozzirollLike extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "liked_user_id")
    private User likedUser;

    @ManyToOne
    @JoinColumn(name = "user_mozziroll_id")
    private UserMozziroll likedUserMozziroll;
}