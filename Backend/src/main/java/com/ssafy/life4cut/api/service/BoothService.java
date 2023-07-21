package com.ssafy.life4cut.api.service;

import com.ssafy.life4cut.api.request.ConnectionPostReq;
import com.ssafy.life4cut.api.request.SessionPostReq;
import com.ssafy.life4cut.api.response.ConnectionPostRes;
import com.ssafy.life4cut.api.response.SessionRes;
import com.ssafy.life4cut.common.model.response.BaseResponseBody;

public interface BoothService {
    BaseResponseBody<SessionRes> createBooth(SessionPostReq request) throws Exception;

    BaseResponseBody<SessionRes> joinBooth(String shareCode);

    BaseResponseBody<ConnectionPostRes> getConnectionToken(ConnectionPostReq request) throws Exception;
}
