package com.ssafy.life4cut.db.entity.local;

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
    @Column(length = 30, nullable = true) // TODO: ERD에 Nullable로 되있는데 그게 맞는지 확인 필요..
    private String sessionId;
}
