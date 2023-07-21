package com.ssafy.life4cut.api.response;

import java.util.Set;

import com.ssafy.life4cut.common.dto.FrameItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrameListGetRes {
    private Set<FrameItem> frames;
}
