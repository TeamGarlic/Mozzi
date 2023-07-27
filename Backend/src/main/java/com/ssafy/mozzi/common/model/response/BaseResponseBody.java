package com.ssafy.mozzi.common.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponseBody<T> {
    private String message;
    private T data;

    public BaseResponseBody(T data) {
        this.data = data;
    }
}
