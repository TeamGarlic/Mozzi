package com.ssafy.mozzi.api.service;

import java.util.Objects;
import java.util.Optional;

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
import com.ssafy.mozzi.common.util.MozziUtil;
import com.ssafy.mozzi.common.util.mapper.BoothMapper;
import com.ssafy.mozzi.db.datasource.LocalDatasource;
import com.ssafy.mozzi.db.entity.local.Booth;
import com.ssafy.mozzi.db.entity.local.BoothUser;
import com.ssafy.mozzi.db.repository.local.BoothRepository;
import com.ssafy.mozzi.db.repository.local.BoothUserRepository;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import lombok.RequiredArgsConstructor;

/**
 * Openvidu 부스 관리 서비스입니다.
 */
@Service
@PropertySource("classpath:application-keys.properties")
@RequiredArgsConstructor
public class BoothServiceImpl implements BoothService {
    private final BoothRepository boothRepository;

    private final BoothUserRepository boothUserRepository;

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
     * @see BoothMapper
     * @throws DuplicateShareCodeException (Mozzi code : 5, Http Status 400)
     * @throws AccessTokenNotExistsException (Mozzi code : 7, Http Status 401)
     * @throws RuntimeException (Mozzi code : 0, Http Status 500)
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public SessionRes createBooth(SessionPostReq request, String accessToken) {
        if (accessToken == null) {
            throw new AccessTokenNotExistsException("There is no access Token");
        }

        String shareCode = request.getShareCode();
        Optional<Booth> booth = null;
        if (shareCode == null) {
            do {
                shareCode = mozziUtil.generateString(20);
                booth = boothRepository.findByShareCode(shareCode);
            } while (booth.isPresent());
        } else {
            booth = boothRepository.findByShareCode(shareCode);
            if (booth.isPresent()) {
                throw new DuplicateShareCodeException(String.format("Duplicated booth share code(%s)", shareCode));
            }
        }
        sessionCreation:
        while (true) {
            String sessionId = mozziUtil.generateString(20);
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
                Session session = null;
                try {
                    openVidu.createSession(properties);
                } catch (OpenViduHttpException exception) {
                    switch (exception.getStatus()) {
                        case 409:
                            continue sessionCreation;
                        default:
                            throw new RuntimeException("Fail to create openvidu session");
                    }
                } catch (Exception exception) {
                    throw new RuntimeException("Fail to create openvidu session");
                }

                return BoothMapper.toSessionRes(session.getSessionId(), shareCode);
            }
        }
    }

    /**
     * 공유 코드를 이용하여 참여하고자하는 openvidu의 session Id를 반환받습니다.
     *
     * @param shareCode 참여하고자 하는 부스의 Share Code
     * @return openvidu session id
     * @see Session
     * @see BoothMapper
     * @throws ShareCodeNotExistException (Mozzi code : 6, Http Status 400)
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public SessionRes joinBooth(String shareCode) {
        Optional<Booth> booth = boothRepository.findByShareCode(shareCode);
        if (booth.isEmpty()) {
            throw new ShareCodeNotExistException(String.format("Requested booth(%s) not exist", shareCode));
        }
        return BoothMapper.toSessionRes(booth.get().getSessionId(), shareCode);
    }

    /**
     * Openvidu Session Id를 이용하여 Openvidu Connection Token을 반환합니다
     *
     * @param request session id가 담긴 요청
     * @return Openvidu Connection Token
     * @see Session
     * @see Connection
     * @see BoothMapper
     * @throws InvalidSessionIdException (Mozzi code : 12, Http Status 400)
     * @throws RuntimeException (Mozzi code : 0, Http Status 500)
     */
    @Override
    public ConnectionPostRes getConnectionToken(ConnectionPostReq request, String accessToken) {
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
                BoothUser connectedUser = BoothUser.builder()
                    .userId(userId)
                    .booth(booth.get())
                    .build();
                boothUserRepository.save(connectedUser);
            }
        }

        Connection connection = null;
        try {
            connection = session.createConnection();
        } catch (OpenViduHttpException e) {
            switch (e.getStatus()) {
                case 404:
                    throw new InvalidSessionIdException("Requested Booth not exists. It could be destroyed.");
                default:
                    throw new RuntimeException("Fail to create Connection");
            }
        } catch (Exception e) {
            throw new RuntimeException("Fail to create Connection");
        }

        return BoothMapper.toConnectionPostRes(connection);
    }

    /**
     * SessionId 를 입력받아 해당 SessionId에 해당하는 h2 Booth 와 openvidu Booth 를 삭제합니다.
     *
     * @param sessionId session id 요청
     * @return SessionRes
     * @see Session
     * @see Connection
     * @see BoothMapper
     * @throws InvalidSessionIdException (Mozzi code : 13, Http Status 400)
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public SessionRes deleteBooth(String sessionId) throws Exception {
        Session session = openVidu.getActiveSession(sessionId);
        if (session == null) {
            throw new InvalidSessionIdException(
                String.format("You requested invalid session(%s). It could be destroyed.", sessionId));
        }
        session.close();

        Optional<Booth> booth = boothRepository.findBySessionId(sessionId);
        booth.ifPresent(boothRepository::delete);
        return BoothMapper.toSessionRes(sessionId, "");
    }

}
