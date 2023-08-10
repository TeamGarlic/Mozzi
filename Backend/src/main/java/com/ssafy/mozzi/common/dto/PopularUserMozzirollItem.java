package com.ssafy.mozzi.common.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * popularUserMozzirollRes 응답을 위한 DTD Object
 * @see com.ssafy.mozzi.db.entity.remote.UserMozziroll
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PopularUserMozzirollItem {
    private long id;
    private String objectName;
    private String title;
    private LocalDateTime createdAt;
    @NotNull
    private boolean isLiked = false;
    private int likeCount;
    private UserItem creator;
}
