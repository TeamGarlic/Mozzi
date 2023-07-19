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
    String message = null;
    T data = null; // Todo: Object 말고 대체 가능한 것이 있는가?

    public BaseResponseBody(T data) {
        this.data = data;
    }

    // public static BaseResponseBody of(String message, Object data) {
    //     BaseResponseBody body = new BaseResponseBody();
    //     body.message = message;
    //     body.data = data;
    //     return body;
    // }
}
