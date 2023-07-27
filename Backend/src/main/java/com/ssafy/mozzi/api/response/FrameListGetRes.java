package com.ssafy.mozzi.api.response;

import java.util.List;

import com.ssafy.mozzi.common.dto.FrameItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrameListGetRes {
    private List<FrameItem> frames;
}
