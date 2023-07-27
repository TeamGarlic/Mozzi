package com.ssafy.mozzi.common.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Frame 응답을 위한 DTD Object
 * @see com.ssafy.mozzi.db.entity.remote.Frame
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrameItem {
    private Long id;
    private String url;
    private List<FrameClipItem> rects;
}
