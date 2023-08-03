package com.ssafy.mozzi.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Background 응답을 위한 DTD Object
 * @see com.ssafy.mozzi.db.entity.remote.Backgroud
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackgroundItem {
    private long id;
    private String objectName;
    private String title;
}
