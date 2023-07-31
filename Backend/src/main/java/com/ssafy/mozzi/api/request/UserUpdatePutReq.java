package com.ssafy.mozzi.api.request;

import lombok.Data;

@Data
public class UserUpdatePutReq {
    private String accessToken;
    private String password;
    private String nickname;
    private String email;
}
