package com.ssafy.mozzi.api.service;

import java.util.HashMap;
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
import com.ssafy.mozzi.api.response.TemporalFileSavePostRes;
import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;
import com.ssafy.mozzi.common.exception.handler.BadRequestException;
import com.ssafy.mozzi.common.exception.handler.NotFoundException;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;
import com.ssafy.mozzi.common.util.MozziUtil;
import com.ssafy.mozzi.common.util.mapper.BoothMapper;
import com.ssafy.mozzi.db.datasource.LocalDatasource;
import com.ssafy.mozzi.db.entity.local.Booth;
import com.ssafy.mozzi.db.entity.local.BoothUser;
import com.ssafy.mozzi.db.entity.remote.User;
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

    private final UserService userService;

    private final MozziUtil mozziUtil;

    private final OpenVidu openVidu;
    private final HashMap<String, HashMap<String, String>> map = new HashMap<>();

    @Autowired
    BoothServiceImpl(BoothRepository boothRepository, BoothUserRepository boothUserRepository, UserService userService,
        MozziUtil mozziUtil,
        Environment env) {
        this.boothRepository = boothRepository;
        this.boothUserRepository = boothUserRepository;
        this.userService = userService;
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
     * @throws BadRequestException (DuplicateShareCode, 5)
     * @throws UnAuthorizedException (AccessTokenNotExists, 7)
     * @throws RuntimeException (Mozzi code : 0, Http Status 500)
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public SessionRes createBooth(SessionPostReq request, String accessToken) {
        if (accessToken == null) {
            throw new UnAuthorizedException(MozziAPIErrorCode.AccessTokenNotExists, "There is no access Token");
        }

        String shareCode = request.getShareCode();
        Optional<Booth> booth = null;
        if (shareCode == null) {
            do {
                shareCode = mozziUtil.generateKoreanToken();
                booth = boothRepository.findByShareCode(shareCode);
            } while (booth.isPresent());
        } else {
            booth = boothRepository.findByShareCode(shareCode);
            if (booth.isPresent()) {
                throw new BadRequestException(MozziAPIErrorCode.DuplicateShareCode,
                    String.format("Duplicated booth share code(%s)", shareCode));
            }
        }
        sessionCreation:
        while (true) {
            String sessionId = mozziUtil.generateString(20, false);
            booth = boothRepository.findBySessionId(sessionId);
            long userId = mozziUtil.findUserIdByToken(accessToken);
            if (booth.isEmpty()) {
                String shareSecret = mozziUtil.generateString(20, true);
                Booth newBooth = Booth.builder()
                    .sessionId(sessionId)
                    .shareCode(shareCode)
                    .shareSecret(shareSecret)
                    .closed(false)
                    .creator(userId)
                    .build();
                boothRepository.save(newBooth);

                SessionProperties properties = new SessionProperties.Builder()
                    .customSessionId(sessionId)
                    .build();
                Session session = null;
                try {
                    session = openVidu.createSession(properties);
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

                return BoothMapper.toSessionRes(session.getSessionId(), shareCode, shareSecret);
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
     * @throws BadRequestException (ShareCodeNotExists, 6)
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public SessionRes joinBooth(String shareCode) {
        Optional<Booth> boothCandidate = boothRepository.findByShareCode(shareCode);
        if (boothCandidate.isEmpty()) {
            throw new BadRequestException(MozziAPIErrorCode.ShareCodeNotExists,
                String.format("Requested booth(%s) not exist", shareCode));
        }
        Booth booth = boothCandidate.get();
        if (booth.getClosed()) {
            throw new BadRequestException(MozziAPIErrorCode.ShareCodeNotExists,
                String.format("Requested booth(%s) is closed", shareCode));
        }
        return BoothMapper.toSessionRes(booth.getSessionId(), shareCode, null);
    }

    /**
     * Openvidu Session Id를 이용하여 Openvidu Connection Token을 반환합니다
     *
     * @param request session id가 담긴 요청
     * @return Openvidu Connection Token
     * @see Session
     * @see Connection
     * @see BoothMapper
     * @throws BadRequestException (InvalidSessionId, 12)
     * @throws Exception (Mozzi code : 0, Http Status 500)
     */
    @Override
    public ConnectionPostRes getConnectionToken(ConnectionPostReq request, String accessToken) {
        Session session = openVidu.getActiveSession(request.getSessionId());
        if (session == null) {
            throw new BadRequestException(MozziAPIErrorCode.InvalidSessionId,
                String.format("You requested invalid session(%s). It could be destroyed.", request.getSessionId()));
        }
        Optional<Booth> boothCandidate = boothRepository.findBySessionId(request.getSessionId());
        if (boothCandidate.isEmpty()) {
            throw new BadRequestException(MozziAPIErrorCode.InvalidSessionId,
                String.format("You requested invalid session(%s). It could be destroyed.", request.getSessionId()));
        }
        Booth booth = boothCandidate.get();

        if (booth.getClosed()) {
            throw new BadRequestException(MozziAPIErrorCode.InvalidSessionId,
                String.format("Your requested Booth(%s) is closed.", request.getSessionId()));
        }

        if (accessToken != null) {
            long userId = mozziUtil.findUserIdByToken(accessToken);
            long boothId = booth.getId();
            Optional<BoothUser> boothUser = boothUserRepository.findByBoothIdAndUserId(boothId, userId);
            if (boothUser.isEmpty()) {
                BoothUser connectedUser = BoothUser.builder()
                    .userId(userId)
                    .booth(booth)
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
                    throw new BadRequestException(MozziAPIErrorCode.InvalidSessionId,
                        "Requested Booth not exists. It could be destroyed.",
                        "Openvidu session not exists, even spring have it(Maybe data conflict)");
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
     * @throws BadRequestException (InvalidSessionId, 13)
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public SessionRes deleteBooth(String sessionId) throws Exception {
        Session session = openVidu.getActiveSession(sessionId);
        if (session == null) {
            throw new BadRequestException(MozziAPIErrorCode.InvalidSessionId,
                String.format("You requested invalid session(%s). It could be destroyed.", sessionId));
        }
        session.close();
        String shareCode = "";

        Optional<Booth> boothCandidate = boothRepository.findBySessionId(sessionId);
        if (boothCandidate.isPresent()) {
            Booth booth = boothCandidate.get();
            boothUserRepository.deleteByBoothId(booth.getId());
            shareCode = booth.getShareCode();

            if (map.containsKey(booth.getShareCode())) {
                HashMap<String, String> fileMap = map.remove(booth.getShareCode());
                fileMap.clear();
            }
            boothRepository.delete(booth);
        }

        return BoothMapper.toSessionRes(sessionId, shareCode, null);
    }

    /**
     * 부스에서 사용되는 임시 파일을 access token을 이용하여 부스 내의 인원이 맞는 지 확인 후 저장합니다.
     * @throws NotFoundException (UserIdNotExists, 1), (BoothNotExists, 10), (FileAlreadyExists, 15)
     * @throws UnAuthorizedException (UnAuthorized, 11)
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public TemporalFileSavePostRes temporalFileSave(String accessToken, String shareCode, String fileName,
        String file) {
        User user = userService.findUserByToken(accessToken);
        Optional<Booth> boothCandidate = boothRepository.findByShareCode(shareCode);
        if (boothCandidate.isEmpty()) {
            throw new NotFoundException(MozziAPIErrorCode.BoothNotExists, "Requested Booth not exists");
        }
        Booth booth = boothCandidate.get();
        Optional<BoothUser> boothUserCandidate = boothUserRepository.findByBoothIdAndUserId(booth.getId(),
            user.getId());
        if (boothUserCandidate.isEmpty()) {
            throw new UnAuthorizedException(MozziAPIErrorCode.UnAuthorized, "You are not member of booth");
        }
        HashMap<String, String> fileMap = null;
        if (map.containsKey(shareCode)) {
            fileMap = map.get(shareCode);
        } else {
            fileMap = new HashMap<>();
            map.put(shareCode, fileMap);
        }

        if (fileMap.containsKey(fileName)) {
            throw new NotFoundException(MozziAPIErrorCode.FileAlreadyExists,
                String.format("%s already exists", fileName));
        }
        try {
            fileMap.put(fileName, file);
        } catch (Exception e) {
            throw new RuntimeException();
        }

        return BoothMapper.toTemporalFileSaveRes(shareCode, fileName);
    }

    /**
     * 존재하는 부스의 임시 파일을 가져와서 반환합니다.
     * @throws BadRequestException (FileNotExists, 16)
     * @throws NotFoundException (BoothNotExists, 10), (FileNotExists, 16)
     * @throws UnAuthorizedException (UnAuthorized, 11)
     */
    @Override
    public String getTemporalFile(String shareCode, String shareSecret, String fileName) {
        if (!map.containsKey(shareCode)) {
            throw new NotFoundException(MozziAPIErrorCode.BoothNotExists, "Requested Booth not exists");
        }
        Optional<Booth> boothCandidate = boothRepository.findByShareCode(shareCode);
        if (boothCandidate.isEmpty()) {
            throw new NotFoundException(MozziAPIErrorCode.BoothNotExists, "Requested Booth not exists");
        }
        Booth booth = boothCandidate.get();

        if (!booth.getShareSecret().equals(shareSecret)) {
            throw new UnAuthorizedException(MozziAPIErrorCode.UnAuthorized, "You are not allowed to read file");
        }

        HashMap<String, String> fileMap = map.get(shareCode);
        if (!fileMap.containsKey(fileName)) {
            throw new BadRequestException(MozziAPIErrorCode.FileNotExists,
                String.format("Request file %s not exists.", fileName));
        }

        return fileMap.get(fileName);
    }

    /**
     * 방장으로부터 참여 제한을 하고 싶은 부스 정보를 받아, 열려 있다면 닫고, 닫혀있다면 그대로 둡니다.
     * @throws NotFoundException (UserIdNotExists, 1), (BoothNotExists, 10)
     * @throws UnAuthorizedException (UnAuthorized, 11)
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public boolean close(String accessToken, String shareCode) {
        User user = userService.findUserByToken(accessToken);
        Optional<Booth> boothCandidate = boothRepository.findByShareCode(shareCode);
        if (boothCandidate.isEmpty()) {
            throw new NotFoundException(MozziAPIErrorCode.BoothNotExists, "Requested Booth not exists");
        }
        Booth booth = boothCandidate.get();
        if (!Objects.equals(booth.getCreator(), user.getId())) {
            throw new UnAuthorizedException(MozziAPIErrorCode.UnAuthorized, "You are not the creator of booth");
        }
        boolean result = !booth.getClosed();
        booth.setClosed(true);
        return result;
    }
}
