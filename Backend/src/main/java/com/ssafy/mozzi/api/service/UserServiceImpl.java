package com.ssafy.mozzi.api.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.mozzi.api.request.ReIssuePostReq;
import com.ssafy.mozzi.api.request.UserLoginPostReq;
import com.ssafy.mozzi.api.request.UserRegisterPostReq;
import com.ssafy.mozzi.api.request.UserUpdatePutReq;
import com.ssafy.mozzi.api.response.ReIssuePostRes;
import com.ssafy.mozzi.api.response.UserIdCheckRes;
import com.ssafy.mozzi.api.response.UserInfoRes;
import com.ssafy.mozzi.api.response.UserLoginPostRes;
import com.ssafy.mozzi.api.response.UserRegisterPostRes;
import com.ssafy.mozzi.api.response.UserUpdateRes;
import com.ssafy.mozzi.common.auth.JwtTokenProvider;
import com.ssafy.mozzi.common.exception.handler.DuplicatedUserIdException;
import com.ssafy.mozzi.common.exception.handler.InvalidRefreshTokenException;
import com.ssafy.mozzi.common.exception.handler.NoDataException;
import com.ssafy.mozzi.common.exception.handler.UserIdNotExistsException;
import com.ssafy.mozzi.common.exception.handler.UserLoginFailException;
import com.ssafy.mozzi.common.util.mapper.UserMapper;
import com.ssafy.mozzi.db.datasource.RemoteDatasource;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.repository.remote.UserRepository;

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
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
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
    public UserIdCheckRes userIdCheck(String userId) {
        Optional<User> user = userRepository.findByUserId(userId);
        boolean result = user.isEmpty();
        return new UserIdCheckRes(result);
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
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public ReIssuePostRes reissue(ReIssuePostReq reissueInfo) {
        User user = findUserByToken(reissueInfo.getAccessToken());

        if (!user.getRefreshToken().equals(reissueInfo.getRefreshToken()))
            throw new InvalidRefreshTokenException("refresh token is not validated");

        String accessToken = jwtTokenProvider.createToken(user.getId().toString());
        String refreshToken = jwtTokenProvider.createRefreshToken();
        user.setRefreshToken(refreshToken);

        return UserMapper.toReissueRes(accessToken, refreshToken);
    }

    /**
     *  Token으로 User를 찾는 Service/비즈니스 로직
     * @param accessToken String
     * @return User
     * @see UserRepository
     * @see JwtTokenProvider
     */

    @Override
    public User findUserByToken(String accessToken) {
        Authentication auth = jwtTokenProvider.getAuthentication(accessToken);
        UserDetails userDetails = (UserDetails)auth.getPrincipal();
        String id = userDetails.getUsername();
        Optional<User> user = userRepository.findById(Long.parseLong(id));
        if (user.isEmpty()) {
            throw new UserIdNotExistsException("Valid Access Token, No user matched");
        }
        return user.get();
    }

    /**
     *  헤더에서 입력받은 accessToken으로 유저 정보를 반환하는 로직
     * @param accessToken String
     * @return BaseResponseBody<UserInfoRes>
     * @see UserInfoRes
     */
    @Override
    public UserInfoRes getUserInfo(String accessToken) {
        User user = findUserByToken(accessToken);

        if (user == null) {
            throw new UserIdNotExistsException("user not exists");
        }

        return UserMapper.toUserInfoRes(user);
    }

    /**
     *  헤더에서 입력받은 accessToken 으로 유저의 리프레쉬 토큰을 null 값으로 변경하는 로직
     * @param accessToken String
     * @return BaseResponseBody<String>
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public void logout(String accessToken) {
        User user = findUserByToken(accessToken);

        if (user == null) {
            throw new UserIdNotExistsException("user not exists");
        }

        user.setRefreshToken(null);
    }

    /**
     * 유저 데이터 변경 요청을 받아 유저 데이터를 수정합니다.
     * @param request
     * @return BaseResponseBody<Long> 성공시 User Id를 같이 반환합니다.
     * @throws UserIdNotExistsException
     */
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    @Override
    public UserUpdateRes update(UserUpdatePutReq request) {
        User user = findUserByToken(request.getAccessToken());

        if (request.getEmail() == null && request.getNickname() == null && request.getPassword() == null) {
            throw new NoDataException("There is no data for update");
        }

        if (request.getPassword() != null && !request.getPassword().equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        return UserMapper.toUserUpdateRes(user);
    }
}
