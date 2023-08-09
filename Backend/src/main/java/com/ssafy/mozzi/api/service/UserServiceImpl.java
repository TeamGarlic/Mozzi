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
import com.ssafy.mozzi.api.response.UserPasswordResetPostRes;
import com.ssafy.mozzi.api.response.UserRegisterPostRes;
import com.ssafy.mozzi.api.response.UserUpdateRes;
import com.ssafy.mozzi.common.auth.JwtTokenProvider;
import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;
import com.ssafy.mozzi.common.exception.NotFoundException;
import com.ssafy.mozzi.common.exception.handler.InvalidRefreshTokenException;
import com.ssafy.mozzi.common.exception.handler.NoDataException;
import com.ssafy.mozzi.common.exception.handler.UserEmailNotExists;
import com.ssafy.mozzi.common.exception.handler.UserLoginFailException;
import com.ssafy.mozzi.common.exception.handler.UserRegisterException;
import com.ssafy.mozzi.common.util.MozziUtil;
import com.ssafy.mozzi.common.util.mapper.UserMapper;
import com.ssafy.mozzi.db.datasource.RemoteDatasource;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.repository.remote.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 *  User 요청에 대한 Service/비즈니스 로직 구현
 *
 * @see UserRepository
 * @see User
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtTokenProvider jwtTokenProvider;
    private final MozziUtil mozziUtil;
    private final EmailService emailService;

    /**
     *  회원 가입 Service/비즈니스 로직
     *
     * @param request UserRegisterPostReq
     * @return UserRegisterPostRes
     * @throws UserRegisterException (Mozzi code : 3, Http Status 400)
     * @see UserRepository
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public UserRegisterPostRes register(UserRegisterPostReq request) {
        User user = UserMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            userRepository.save(user);
        } catch (
            Exception e) {
            log.error("[User Save error] : {}", e.getMessage());
            throw new UserRegisterException(String.format("Duplicated user id(%s)", request.getUserId()));
        }
        return UserMapper.toRegistRes(user);
    }

    /**
     *  로그인 Service/비즈니스 로직
     *
     * @param request UserLoginPostReq
     * @return UserLoginPostRes
     * @throws com.ssafy.mozzi.common.exception.NotFoundException (UserIdNotExists, 1)
     * @throws UserLoginFailException (Mozzi code : 4, Http Status 400)
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
            throw new NotFoundException(MozziAPIErrorCode.UserLoginFail, "User ID not exist");
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
     * @throws InvalidRefreshTokenException (Mozzi code : 2, Http Status 400)
     * @throws com.ssafy.mozzi.common.exception.NotFoundException (UserIdNotExists, 1)
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
     * @throws NotFoundException (UserIdNotExistsException, 1)
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
            throw new NotFoundException(MozziAPIErrorCode.UserIdNotExists, "Valid Access Token, No user matched");
        }
        return user.get();
    }

    /**
     *  헤더에서 입력받은 accessToken으로 유저 정보를 반환하는 로직
     * @param accessToken String
     * @return BaseResponseBody<UserInfoRes>
     * @throws NotFoundException (UserIdNotExists, 1)
     * @see UserInfoRes
     */
    @Override
    public UserInfoRes getUserInfo(String accessToken) {
        User user = findUserByToken(accessToken);

        if (user == null) {
            throw new NotFoundException(MozziAPIErrorCode.UserIdNotExists, "User Not exists");
        }

        return UserMapper.toUserInfoRes(user);
    }

    /**
     *  헤더에서 입력받은 accessToken 으로 유저의 리프레쉬 토큰을 null 값으로 변경하는 로직
     * @param accessToken String
     * @return BaseResponseBody<String>
     * @throws NotFoundException (UserIdNotExists, 1)
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public void logout(String accessToken) {
        User user = findUserByToken(accessToken);

        if (user == null) {
            throw new NotFoundException(MozziAPIErrorCode.UserIdNotExists, "User not exists");
        }

        user.setRefreshToken(null);
    }

    /**
     * 유저 데이터 변경 요청을 받아 유저 데이터를 수정합니다.
     * @param request
     * @return BaseResponseBody<Long> 성공시 User Id를 같이 반환합니다.
     * @throws com.ssafy.mozzi.common.exception.NotFoundException (UserIdNotExists, 1)
     * @throws NoDataException (Mozzi code : 13, Http Status 400)
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

    /**
     * 사용자의 패스워드 초기화 요청을 받아서 새로운 패스워드를 메일로 보냅니다.
     * @param userId 초기화할 유저의 ID
     * @throws NotFoundException (UserIdNotExists, 1)
     * @throws com.ssafy.mozzi.common.exception.handler.UserEmailNotExists (Mozzi code : 14, Http Status 400)
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public UserPasswordResetPostRes reset(String userId) {
        Optional<User> candidateUser = userRepository.findByUserId(userId);

        if (candidateUser.isEmpty()) {
            throw new NotFoundException(MozziAPIErrorCode.UserIdNotExists, "User Id not exists");
        }

        User user = candidateUser.get();
        if (user.getEmail() == null || user.getEmail().equals("")) {
            throw new UserEmailNotExists(String.format("%s don't have email address.", userId));
        }

        String newPassword = mozziUtil.generateString(10, true);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.flush();

        emailService.passwordReset(user.getEmail(), newPassword);

        return new UserPasswordResetPostRes(user.getEmail());
    }

    /**
     * 사용자의 accessToken을 입력 받아서 해당 유저를 삭제합니다.
     * @param accessToekn 유저의 accessToken
     * @throws com.ssafy.mozzi.common.exception.NotFoundException (UserIdNotExists, 1)
     * @throws com.ssafy.mozzi.common.exception.handler.UserEmailNotExists (Mozzi code : 14, Http Status 400)
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public UserInfoRes withdrawUser(String accessToekn) {

        User user = findUserByToken(accessToekn);
        userRepository.delete(user);
        return UserMapper.toUserInfoRes(user);
    }
}
