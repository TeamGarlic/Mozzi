package com.ssafy.mozzi.api.service;

import java.util.Objects;
import java.util.Optional;
import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.mozzi.api.request.ConnectionPostReq;
import com.ssafy.mozzi.api.request.SessionPostReq;
import com.ssafy.mozzi.api.response.ConnectionPostRes;
import com.ssafy.mozzi.api.response.SessionRes;
import com.ssafy.mozzi.common.exception.handler.AccessTokenNotExistsException;
import com.ssafy.mozzi.common.exception.handler.DuplicateShareCodeException;
import com.ssafy.mozzi.common.exception.handler.InvalidSessionIdException;
import com.ssafy.mozzi.common.exception.handler.ShareCodeNotExistException;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;
import com.ssafy.mozzi.common.util.MozziUtil;
import com.ssafy.mozzi.db.datasource.LocalDatasource;
import com.ssafy.mozzi.db.entity.local.Booth;
import com.ssafy.mozzi.db.entity.local.BoothUser;
import com.ssafy.mozzi.db.repository.local.BoothRepository;
import com.ssafy.mozzi.db.repository.local.BoothUserRepository;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;

/**
 * Openvidu 부스 관리 서비스입니다.
 */
@Service
@PropertySource("classpath:application-keys.properties")
public class BoothServiceImpl implements BoothService {
    private final BoothRepository boothRepository;

    private final BoothUserRepository boothUserRepository;

    private final RandomGenerator random = RandomGeneratorFactory
        .getDefault().create(System.currentTimeMillis());

    private final MozziUtil mozziUtil;

    private final OpenVidu openVidu;

    @Autowired
    BoothServiceImpl(BoothRepository boothRepository, BoothUserRepository boothUserRepository, MozziUtil mozziUtil,
        Environment env) {
        this.boothRepository = boothRepository;
        this.boothUserRepository = boothUserRepository;
        this.mozziUtil = mozziUtil;
        this.openVidu = new OpenVidu(Objects.requireNonNull(env.getProperty("OPENVIDU_URL")),
            Objects.requireNonNull(env.getProperty("OPENVIDU_SECRET")));
    }

    /**
     * 새로 만들고자 하는 부스의 공유 코드를 받아서 새로운 부스를 생성하고, session Id를 반환합니다.
     *
     * @param request Session creation request
     * @return Openvidu에서 사용되는 부스의 session Id
     * @see Session
     * @see SessionPostReq
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public BaseResponseBody<SessionRes> createBooth(SessionPostReq request, String accessToken) throws Exception {
        if (accessToken == null) {
            throw new AccessTokenNotExistsException("There is no access Token");
        }

        String shareCode = request.getShareCode();
        Optional<Booth> booth = null;
        if (shareCode == null) {
            do {
                shareCode = generateString(20);
                booth = boothRepository.findByShareCode(shareCode);
            } while (booth.isPresent());
        } else {
            booth = boothRepository.findByShareCode(shareCode);
            if (booth.isPresent()) {
                throw new DuplicateShareCodeException(String.format("Duplicated booth share code(%s)", shareCode));
            }
        }

        while (true) {
            String sessionId = generateString(20);
            booth = boothRepository.findBySessionId(sessionId);
            if (booth.isEmpty()) {
                Booth newBooth = Booth.builder()
                    .sessionId(sessionId)
                    .shareCode(shareCode)
                    .creator(mozziUtil.findUserIdByToken(accessToken))
                    .creator(1L)
                    .build();
                boothRepository.save(newBooth);

                SessionProperties properties = new SessionProperties.Builder()
                    .customSessionId(sessionId)
                    .build();
                Session session = openVidu.createSession(properties);
                return BaseResponseBody.<SessionRes>builder()
                    .message("Requested booth created")
                    .data(
                        SessionRes.builder()
                            .shareCode(shareCode)
                            .sessionId(session.getSessionId())
                            .build()
                    )
                    .build();
            }
        }
    }

    /**
     * 공유 코드를 이용하여 참여하고자하는 openvidu의 session Id를 반환받습니다.
     *
     * @param shareCode 참여하고자 하는 부스의 Share Code
     * @return openvidu session id
     * @see Session
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public BaseResponseBody<SessionRes> joinBooth(String shareCode) {
        Optional<Booth> booth = boothRepository.findByShareCode(shareCode);
        if (booth == null) {
            throw new ShareCodeNotExistException(String.format("Requested booth(%s) not exist", shareCode));
        }
        return BaseResponseBody.<SessionRes>builder()
            .message("Requested booth exists")
            .data(
                SessionRes.builder()
                    .shareCode(shareCode)
                    .sessionId(booth.get().getSessionId())
                    .build()
            )
            .build();
    }

    /**
     * Openvidu Session Id를 이용하여 Openvidu Connection Token을 반환합니다
     *
     * @param request session id가 담긴 요청
     * @return Openvidu Connection Token
     * @see Session
     * @see Connection
     */
    @Override
    public BaseResponseBody<ConnectionPostRes> getConnectionToken(ConnectionPostReq request, String accessToken) throws
        Exception {
        Session session = openVidu.getActiveSession(request.getSessionId());
        if (session == null) {
            throw new InvalidSessionIdException(
                String.format("You requested invalid session(%s). It could be destroyed.", request.getSessionId()));
        }
        Optional<Booth> booth = boothRepository.findBySessionId(request.getSessionId());
        if (booth.isEmpty()) {
            throw new InvalidSessionIdException(
                String.format("You requested invalid session(%s). It could be destroyed.", request.getSessionId()));
        }

        if (accessToken != null) {
            long userId = mozziUtil.findUserIdByToken(accessToken);
            long boothId = booth.get().getId();
            Optional<BoothUser> boothUser = boothUserRepository.findByBoothIdAndUserId(boothId, userId);
            if (boothUser.isEmpty()) {
                BoothUser connectedUser = new BoothUser();
                connectedUser.setUserId(userId);
                connectedUser.setBooth(booth.get());
                boothUserRepository.save(connectedUser);
            }
        }

        Connection connection = session.createConnection();
        return BaseResponseBody.<ConnectionPostRes>builder()
            .message("Connection Token created")
            .data(
                ConnectionPostRes.builder()
                    .token(connection.getToken())
                    .build()
            )
            .build();
    }

    /**
     * SessionId 를 입력받아 해당 SessionId에 해당하는 h2 Booth 와 openvidu Booth 를 삭제합니다.
     *
     * @param sessionId session id 요청
     * @return SessionRes
     * @see Session
     * @see Connection
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public BaseResponseBody<SessionRes> deleteBooth(String sessionId) throws Exception {
        Session session = openVidu.getActiveSession(sessionId);
        if (session == null) {
            throw new InvalidSessionIdException(
                String.format("You requested invalid session(%s). It could be destroyed.", sessionId));
        }
        session.close();

        Optional<Booth> booth = boothRepository.findBySessionId(sessionId);
        booth.ifPresent(boothRepository::delete);

        return BaseResponseBody.<SessionRes>builder()
            .message("deleted exist booth")
            .data(
                SessionRes.builder()
                    .shareCode("")
                    .sessionId(sessionId)
                    .build()
            )
            .build();
    }

    /**
     * 영문자/숫자로 구성된 length 만큼의 랜덤한 문자열을 만듭니다.
     *
     * @param length 생성할 문자열의 길이
     * @return 생성된 랜덤한 문자열
     */
    private String generateString(int length) {
        StringBuilder sb = new StringBuilder();
        int[] rands
            = random.ints(length, 0, 62)
            .toArray();
        for (int rand : rands) {
            if (rand < 10) {
                sb.append(rand);
            } else if (rand < 36) {
                sb.append((char)('a' + rand - 10));
            } else {
                sb.append((char)('A' + rand - 36));
            }
        }
        return sb.toString();
    }

}
