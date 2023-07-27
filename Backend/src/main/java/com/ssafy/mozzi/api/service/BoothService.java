package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.request.ConnectionPostReq;
import com.ssafy.mozzi.api.request.SessionPostReq;
import com.ssafy.mozzi.api.response.ConnectionPostRes;
import com.ssafy.mozzi.api.response.SessionRes;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;

public interface BoothService {
    BaseResponseBody<SessionRes> createBooth(SessionPostReq request) throws Exception;

    BaseResponseBody<SessionRes> joinBooth(String shareCode);

    BaseResponseBody<ConnectionPostRes> getConnectionToken(ConnectionPostReq request) throws Exception;
}
