package com.ssafy.life4cut.common.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Frame 응답을 위한 DTD Object
 * @see com.ssafy.life4cut.db.entity.remote.Frame
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrameItem {
    private Long id;
    private String url;
    private Set<FrameClipItem> rects;
}
