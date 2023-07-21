package com.ssafy.life4cut.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FrameClip 응답을 위한 DTD Object
 * @see com.ssafy.life4cut.db.entity.remote.FrameClip
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrameClipItem {
    private double width;
    private double height;
    private double x;
    private double y;
}
