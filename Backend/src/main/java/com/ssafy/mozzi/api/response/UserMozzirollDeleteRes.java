package com.ssafy.mozzi.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *  유저 모찌롤 삭제 응답 Object
 *
 * @see com.ssafy.mozzi.api.service.MozzirollService
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMozzirollDeleteRes {
    private boolean deleted;
    private String title;
    private long id;
}
