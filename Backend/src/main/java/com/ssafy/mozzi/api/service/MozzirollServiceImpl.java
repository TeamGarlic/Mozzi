package com.ssafy.mozzi.api.service;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.common.exception.handler.AlreadyLinkedMozziException;
import com.ssafy.mozzi.common.exception.handler.BoothNotExistsException;
import com.ssafy.mozzi.common.exception.handler.MozzirollNotExists;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;
import com.ssafy.mozzi.common.util.MozziUtil;
import com.ssafy.mozzi.db.entity.local.Booth;
import com.ssafy.mozzi.db.entity.local.BoothUser;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;
import com.ssafy.mozzi.db.repository.local.BoothRepository;
import com.ssafy.mozzi.db.repository.local.BoothUserRepository;
import com.ssafy.mozzi.db.repository.remote.MozzirollRepository;
import com.ssafy.mozzi.db.repository.remote.UserMozzirollRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Moziiroll 관리 서비스입니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MozzirollServiceImpl implements MozzirollService {
    private final UserService userService;
    private final MozzirollRepository mozzirollRepository;
    private final UserMozzirollRepository userMozzirollRepository;
    private final MozziUtil mozziUtil;
    private final BoothRepository boothRepository;
    private final BoothUserRepository boothUserRepository;

    /**
     * 사용자 계정에 Mozziroll 연결 요청을 유효성 확인 후 연결합니다.
     * @param request MozziLinked Request
     * @param accessToken JWT Access Token
     */
    @Override
    public ResponseEntity<BaseResponseBody<Long>> link(MozziLinkPostRequest request, String accessToken) {
        long userId = mozziUtil.findUserIdByToken(accessToken);
        UserMozziroll userMozziroll = userMozzirollRepository.findByMozzirollIdAndUserId(userId,
            request.getMozzirollId());

        if (userMozziroll != null) {
            throw new AlreadyLinkedMozziException(
                String.format("Mozzi %d is already registered Mozzi.", request.getMozzirollId()));
        }
        Mozziroll mozziroll = mozzirollRepository.getReferenceById(request.getMozzirollId());
        if (mozziroll == null) {
            throw new MozzirollNotExists("Requested Mozziroll not exists");
        }

        Optional<Booth> booth = boothRepository.findById(request.getBoothId());
        if (booth.isEmpty()) {
            throw new BoothNotExistsException("Requested Booth not exists");
        }

        List<BoothUser> connectedUsers = boothUserRepository.findByBoothId(request.getBoothId());
        if (connectedUsers == null) {
            throw new UnAuthorizedException("You are not authorized to linked mozziroll");
        }

        boolean authorized = false;
        for (BoothUser user : connectedUsers) {
            if (user.getUserId() == userId) {
                authorized = true;
                break;
            }
        }

        if (!authorized) {
            throw new UnAuthorizedException("You are not authorized to linked mozziroll");
        }

        userMozziroll = UserMozziroll.builder()
            .user(userService.findUserByToken(accessToken))
            .mozziroll(mozziroll)
            .title(request.getTitle())
            .build();
        userMozzirollRepository.save(userMozziroll);

        return ResponseEntity.ok()
            .body(
                BaseResponseBody.<Long>builder()
                    .message("Mozziroll Linked")
                    .data(userMozziroll.getId())
                    .build()
            );
    }
}
