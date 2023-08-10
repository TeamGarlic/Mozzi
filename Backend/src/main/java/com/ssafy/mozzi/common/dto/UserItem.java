package com.ssafy.mozzi.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User 응답 위한 DTD Object
 * @see com.ssafy.mozzi.db.entity.remote.User
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserItem {
    private Long id;
    private String userId;
    private String nickname;
}
