package com.ssafy.life4cut.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Background 응답을 위한 DTD Object
 * @see com.ssafy.life4cut.db.entity.Backgroud
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackgroundItem {
    private long id;
    private String url;
}
