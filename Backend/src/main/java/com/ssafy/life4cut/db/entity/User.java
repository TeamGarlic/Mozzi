package com.ssafy.life4cut.db.entity;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

/**
 * @see BaseEntity
 *
 * 설명 User Model
 */
@SuppressWarnings("checkstyle:RegexpMultiline")
@Entity
@Data
public class User extends BaseEntity {

    String userId;
    String nickname;

    @Column(nullable = true)
    String email;

    @Temporal(TemporalType.TIMESTAMP)
    Timestamp createdAt;

    boolean deleted = false;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    String password;
}