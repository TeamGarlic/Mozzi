package com.ssafy.mozzi.common.dto;

import org.springframework.core.io.Resource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObjectFileItem {
    private Resource file;
    private String fileName;
}
