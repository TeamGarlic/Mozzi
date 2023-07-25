package com.ssafy.life4cut.api.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.life4cut.api.request.UserLoginPostReq;
import com.ssafy.life4cut.api.request.UserRegisterPostReq;
import com.ssafy.life4cut.api.request.reissuePostReq;
import com.ssafy.life4cut.api.response.UserIdCheckRes;
import com.ssafy.life4cut.api.response.UserLoginPostRes;
import com.ssafy.life4cut.api.response.UserRegisterPostRes;
import com.ssafy.life4cut.api.response.reissuePostRes;
import com.ssafy.life4cut.common.auth.JwtTokenProvider;
import com.ssafy.life4cut.common.exception.handler.DuplicatedUserIdException;
import com.ssafy.life4cut.common.exception.handler.InvalidRefreshTokenException;
import com.ssafy.life4cut.common.exception.handler.UserIdNotExistsException;
import com.ssafy.life4cut.common.exception.handler.UserLoginFailException;
import com.ssafy.life4cut.common.model.response.BaseResponseBody;
import com.ssafy.life4cut.common.util.mapper.UserMapper;
import com.ssafy.life4cut.db.datasource.LocalDatasource;
import com.ssafy.life4cut.db.datasource.RemoteDatasource;
import com.ssafy.life4cut.db.entity.remote.User;
import com.ssafy.life4cut.db.repository.remote.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 *  User 요청에 대한 Service/비즈니스 로직 구현
 *
 * @see UserRepository
 * @see User
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtTokenProvider jwtTokenProvider;

    /**
     *  회원 가입 Service/비즈니스 로직
     *
     * @param request UserRegisterPostReq
     * @return UserRegisterPostRes
     * @see UserRepository
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public UserRegisterPostRes register(UserRegisterPostReq request) {
        User user = UserMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            userRepository.save(user);
        } catch (Exception e) {
            throw new DuplicatedUserIdException(String.format("Duplicated user id(%s)", request.getUserId()));
        }
        return UserMapper.toRegistRes(user);
    }

    /**
     *  로그인 Service/비즈니스 로직
     *
     * @param request UserLoginPostReq
     * @return UserLoginPostRes
     * @see UserRepository
     */
    @Override
    public UserLoginPostRes login(UserLoginPostReq request) {
        Optional<User> user = userRepository.findByUserId(request.getUserId());
        if (user.isPresent()) {
            if (passwordEncoder.matches(
                request.getPassword(), user.get().getPassword())) {
                user.get().setRefreshToken(jwtTokenProvider.createRefreshToken());
                return UserMapper.toLoginRes(user.get()
                    , jwtTokenProvider.createToken(user.get().getId().toString())
                    , jwtTokenProvider.createRefreshToken());
            } else {
                throw new UserLoginFailException(String.format("Login Fail on %s", request.getUserId()));
            }
        } else {
            throw new UserIdNotExistsException("User ID not exist");
        }
    }

    /**
     * 요청 받은 User Id가 시용 가능한지 여부를 반환하는 메소드입니다.
     * @param userId 사용자에게 입력 받은 user id
     * @return user id 사용 가능 여부를 반환
     */
    @Override
    public BaseResponseBody<UserIdCheckRes> userIdCheck(String userId) {
        Optional<User> user = userRepository.findByUserId(userId);
        boolean result = user.isEmpty();
        return BaseResponseBody.<UserIdCheckRes>builder()
            .message(String.format("Requested User ID%s available", (result ? "" : " not")))
            .data(
                new UserIdCheckRes(result)
            )
            .build();
    }

    /**
     *  accessToken 재발급 Service/비즈니스 로직
     *
     * @param reissueInfo reissuePostReq
     * @return reissuePostRes
     * @see UserRepository
     * @see JwtTokenProvider
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public reissuePostRes reissue(reissuePostReq reissueInfo) {
        if (!jwtTokenProvider.validateTokenExceptExpiration(reissueInfo.getRefreshToken()))
            throw new InvalidRefreshTokenException("expired refreshToken");

        User user = findUserByToken(reissueInfo);

        if (!user.getRefreshToken().equals(reissueInfo.getRefreshToken()))
            throw new InvalidRefreshTokenException("refresh token is not validated");

        String accessToken = jwtTokenProvider.createToken(user.getId().toString());
        String refreshToken = jwtTokenProvider.createRefreshToken();
        user.setRefreshToken(refreshToken);

        return UserMapper.toReissueRes(accessToken, refreshToken);
    }

    /**
     *  Token으로 User를 찾는 Service/비즈니스 로직
     * @param reissueInfo reissuePostReq
     * @return User
     * @see UserRepository
     * @see JwtTokenProvider
     */

    public User findUserByToken(reissuePostReq reissueInfo) {
        Authentication auth = jwtTokenProvider.getAuthentication(reissueInfo.getAccessToken());
        UserDetails userDetails = (UserDetails)auth.getPrincipal();
        String id = userDetails.getUsername();
        return userRepository.findById(Long.parseLong(id)).orElseThrow();
    }
}
