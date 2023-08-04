package com.ssafy.mozzi.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.common.exception.handler.AlreadyLinkedMozziException;
import com.ssafy.mozzi.common.exception.handler.BoothNotExistsException;
import com.ssafy.mozzi.common.exception.handler.MozzirollNotExists;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;
import com.ssafy.mozzi.common.model.response.BaseResponseBody;
import com.ssafy.mozzi.common.util.MozziUtil;
import com.ssafy.mozzi.common.util.mapper.MozzirollMapper;
import com.ssafy.mozzi.db.entity.local.Booth;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;
import com.ssafy.mozzi.db.repository.local.BoothRepository;
import com.ssafy.mozzi.db.repository.local.BoothUserRepository;
import com.ssafy.mozzi.db.repository.remote.MozzirollRepository;
import com.ssafy.mozzi.db.repository.remote.UserMozzirollRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
        Optional<UserMozziroll> userMozzirollCheck = userMozzirollRepository.findByMozzirollIdAndUserId(
            request.getMozzirollId(), userId);

        if (userMozzirollCheck.isPresent()) {
            throw new AlreadyLinkedMozziException(
                String.format("Mozzi %d is already registered Mozzi.", request.getMozzirollId()));
        }
        Optional<Mozziroll> mozziroll = mozzirollRepository.findById(request.getMozzirollId());
        if (mozziroll.isEmpty()) {
            throw new MozzirollNotExists("Requested Mozziroll not exists");
        }
        Optional<Booth> booth = boothRepository.findByShareCode(request.getShareCode());
        if (booth.isEmpty()) {
            throw new BoothNotExistsException("Requested Booth not exists");
        }

        long boothId = booth.get().getId();
        long creatorId = mozziroll.get().getCreator().getId();
        boolean authorized = boothUserRepository.findByBoothIdAndUserId(boothId, creatorId).isPresent();

        if (!authorized) {
            throw new UnAuthorizedException("You are not authorized to linked mozziroll");
        }

        UserMozziroll userMozziroll = UserMozziroll.builder()
            .user(userService.findUserByToken(accessToken))
            .mozziroll(mozziroll.get())
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

    @Override
    public UserMozzirollGetRes getMozzirollsByUser(String accessToken, int pageNum, int pageSize) {
        User user = userService.findUserByToken(accessToken);
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);
        Page<UserMozziroll> page = userMozzirollRepository.findByUserId(user.getId(), pageRequest);
        List<UserMozziroll> userMozzirolls = page.getContent();
        return MozzirollMapper.toUserMozzirollGetRes(userMozzirolls, page.getTotalPages());
    }
}
