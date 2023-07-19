package com.ssafy.life4cut.common.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponseBody<T> {
    String message;
    T data;

    public BaseResponseBody(T data) {
        this.data = data;
    }
}
