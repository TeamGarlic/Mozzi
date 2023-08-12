package com.ssafy.mozzi.common.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Mozziroll 응답 위한 DTD Object
 * @see com.ssafy.mozzi.db.entity.remote.Mozziroll
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MozzirollItem {
    private long id;
    private String objectName;
    private int width;
    private int height;
    private LocalDateTime createdAt;
}
