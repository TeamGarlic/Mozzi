package com.ssafy.mozzi.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.mozzi.api.request.MozziLinkPostRequest;
import com.ssafy.mozzi.api.response.MozzirollLikeRes;
import com.ssafy.mozzi.api.response.PopularUserMozzirolGetlRes;
import com.ssafy.mozzi.api.response.UserMozzirollDeleteRes;
import com.ssafy.mozzi.api.response.UserMozzirollGetRes;
import com.ssafy.mozzi.common.dto.PopularUserMozzirollEntityDto;
import com.ssafy.mozzi.common.exception.handler.AlreadyLinkedMozziException;
import com.ssafy.mozzi.common.exception.handler.BoothNotExistsException;
import com.ssafy.mozzi.common.exception.handler.MozzirollNotExistsException;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;
import com.ssafy.mozzi.common.exception.handler.UserIdNotExistsException;
import com.ssafy.mozzi.common.util.MozziUtil;
import com.ssafy.mozzi.common.util.mapper.MozzirollMapper;
import com.ssafy.mozzi.db.datasource.RemoteDatasource;
import com.ssafy.mozzi.db.entity.local.Booth;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;
import com.ssafy.mozzi.db.entity.remote.MozzirollLike;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;
import com.ssafy.mozzi.db.repository.local.BoothRepository;
import com.ssafy.mozzi.db.repository.local.BoothUserRepository;
import com.ssafy.mozzi.db.repository.remote.MozzirollLikeRepository;
import com.ssafy.mozzi.db.repository.remote.MozzirollRepository;
import com.ssafy.mozzi.db.repository.remote.UserMozzirollRepository;
import com.ssafy.mozzi.db.repository.remote.UserRepository;

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
    private final MozzirollLikeRepository mozzirollLikeRepository;
    private final UserRepository userRepository;

    /**
     * 사용자 계정에 Mozziroll 연결 요청을 유효성 확인 후 연결합니다.
     * @param request MozziLinked Request
     * @param accessToken JWT Access Token
     * @throws AlreadyLinkedMozziException (Mozzi code : 8, Http Status 400)
     * @throws UnAuthorizedException (Mozzi code : 11, Http Status 401)
     * @throws MozzirollNotExistsException (Mozzi code : 9, Http Status 404)
     * @throws BoothNotExistsException (Mozzi code : 10, Http Status 404)
     * @throws UserIdNotExistsException (Mozzi code : 1, Http Status 404)
     */
    @Override
    public Long link(MozziLinkPostRequest request, String accessToken) {
        long userId = mozziUtil.findUserIdByToken(accessToken);
        Optional<UserMozziroll> userMozzirollCheck = userMozzirollRepository.findByMozzirollIdAndUserId(
            request.getMozzirollId(), userId);

        if (userMozzirollCheck.isPresent()) {
            throw new AlreadyLinkedMozziException(
                String.format("Mozzi %d is already registered Mozzi.", request.getMozzirollId()));
        }
        Optional<Mozziroll> mozziroll = mozzirollRepository.findById(request.getMozzirollId());
        if (mozziroll.isEmpty()) {
            throw new MozzirollNotExistsException("Requested Mozziroll not exists");
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

        UserMozziroll userMozziroll = userMozzirollRepository.save(
            UserMozziroll.builder()
                .user(userService.findUserByToken(accessToken))
                .mozziroll(mozziroll.get())
                .title(request.getTitle())
                .build());

        return userMozziroll.getId();
    }

    /**
     * 사용자의 모찌롤만 반환해줍니다.
     * @param accessToken JWT Access Token
     * @param pageNum int
     * @param pageSize int
     * @return UserMozzirollGetRes
     * @throws UserIdNotExistsException (Mozzi code : 1, Http Status 404)
     */
    @Override
    public UserMozzirollGetRes getMozzirollsByUser(String accessToken, int pageNum, int pageSize) {
        User user = userService.findUserByToken(accessToken);
        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);
        Page<UserMozziroll> page = userMozzirollRepository.findByUserId(user.getId(), pageRequest);
        List<UserMozziroll> userMozzirolls = page.getContent();
        return MozzirollMapper.toUserMozzirollGetRes(userMozzirolls, page.getTotalPages());
    }

    /**
     * 모찌롤을 좋아요 합니다. 이미 좋아요 한 경우 좋아요가 해제됩니다.
     * @param accessToken JWT Access Token
     * @param userMozzirollId long
     * @return MozzirollLikeRes
     * @throws MozzirollNotExistsException (Mozzi code : 1, Http Status 404)
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public MozzirollLikeRes likeMozziroll(String accessToken, long userMozzirollId) throws
        MozzirollNotExistsException,
        UserIdNotExistsException {
        User user = userService.findUserByToken(accessToken);
        UserMozziroll userMozziroll;

        if (userMozzirollRepository.findById(userMozzirollId).isPresent()) {
            userMozziroll = userMozzirollRepository.findById(userMozzirollId).get();
        } else
            throw new MozzirollNotExistsException("Requested userMozziroll not exists");

        // 좋아요가 없을 경우
        boolean isLiked = true;

        // 좋아요가 이미 되어있다면 해당 좋아요를 삭제하고 isLiked 를 false 로 만들어줌.
        Optional<MozzirollLike> like = mozzirollLikeRepository.findByLikedUserAndLikedUserMozziroll(user,
            userMozziroll);
        if (like.isPresent()) {

            user.getLikedMozzirolls().remove(like.get());
            userRepository.save(user);

            userMozziroll.getLikedUsers().remove(like.get());
            userMozzirollRepository.save(userMozziroll);

            mozzirollLikeRepository.delete(like.get());
            isLiked = false;

        }

        // 좋아요가 없을 경우 좋아요를 만들어줌
        if (isLiked) {
            MozzirollLike newLike = new MozzirollLike();
            newLike.setLikedUser(user);
            newLike.setLikedUserMozziroll(userMozziroll);
            mozzirollLikeRepository.save(newLike);

            userMozziroll.getLikedUsers().add(newLike);
            userMozzirollRepository.save(userMozziroll);

            user.getLikedMozzirolls().add(newLike);
            userRepository.save(user);
        }

        return MozzirollMapper.toMozzirollLikeRes(userMozziroll.getLikedUsers().size(), isLiked);
    }

    /**
     * 좋아요 순으로 모찌롤들을 반환해줍니다. posted 값이 true 이며, deleted 값이 false 인 게시물만 출력합니다.
     * @param accessToken JWT Access Token
     * @param pageNum int
     * @param pageSize int
     * @return PopularUserMozzirolGetlRes
     */
    @Override
    public PopularUserMozzirolGetlRes getPopularUserMozzirolls(String accessToken, int pageNum, int pageSize) {
        long userId;

        if (accessToken.equals(""))
            userId = 0;
        else
            userId = userService.findUserByToken(accessToken).getId();

        PageRequest pageRequest = PageRequest.of(pageNum - 1, pageSize);
        Page<PopularUserMozzirollEntityDto> page = userMozzirollRepository.findAllOrderByMozzirollLikeCount(userId,
            pageRequest);
        List<PopularUserMozzirollEntityDto> userMozzirolls = page.getContent();
        return MozzirollMapper.toPopularUserMozzirollGetRes(userMozzirolls, page.getTotalPages());
    }

    /**
     * 유저 모찌롤을 삭제합니다. 이 때 자식또한 같이 삭제 됩니다. (likeMozziroll, mozziroll)
     * mozziroll 은 orphan 이 되었을 때 삭제됩니다.
     * @param accessToken JWT Access Token
     * @param userMozzirollId long
     * @return UserMozzirollDeleteRes
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public UserMozzirollDeleteRes deleteUserMozziroll(String accessToken, long userMozzirollId) throws
        MozzirollNotExistsException {
        User user = userService.findUserByToken(accessToken);
        Optional<UserMozziroll> userMozziroll = userMozzirollRepository.findById(userMozzirollId);
        if (!userMozziroll.isPresent()) {
            throw new MozzirollNotExistsException("user Mozziroll not exists");
        }

        Mozziroll mozziroll = userMozziroll.get().getMozziroll();
        UserMozzirollDeleteRes userMozzirollDeleteRes = MozzirollMapper.toUserMozzirollDeleteRes(userMozziroll.get());

        if (userMozziroll.get().getUser().equals(user)) {
            mozziroll.getUserMozzirolls().remove(userMozziroll.get());
            userMozzirollRepository.delete(userMozziroll.get());
        } else
            throw new UnAuthorizedException("user is not userMozziroll's owner");

        // 만약 mozziroll 이 더이상 어떤 userMozziroll 과 연결 되어있지 않으면 삭제
        if (mozziroll.getUserMozzirolls().size() == 0) {
            mozzirollRepository.delete(mozziroll);
        }

        return userMozzirollDeleteRes;
    }
}
