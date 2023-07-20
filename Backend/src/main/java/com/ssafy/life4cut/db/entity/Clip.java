package com.ssafy.life4cut.db.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * 사용자가 만든 클립을 저장및 사용을 위한 Entity
 * @see User
 */
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Clip extends BaseEntity{

    @Column(length = 500)
    private String url;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private boolean deleted = false;

    @ManyToMany(mappedBy = "clips")
    private Set<User> users = new HashSet<>();
}
