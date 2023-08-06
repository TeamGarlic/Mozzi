package com.ssafy.mozzi.common.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaseErrorResponse {
    private int code;
    @Schema(defaultValue = "message")
    private String message;

    public static class InternalServerErrorResponse extends BaseErrorResponse {

        @Schema(defaultValue = "0")
        private final int code = 0;

        public InternalServerErrorResponse(String message) {
            this.setMessage(message);
        }
    }
}
