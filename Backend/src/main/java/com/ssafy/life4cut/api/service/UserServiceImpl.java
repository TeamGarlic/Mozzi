package com.ssafy.life4cut.api.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.life4cut.api.request.UserLoginPostReq;
import com.ssafy.life4cut.api.request.UserRegisterPostReq;
import com.ssafy.life4cut.api.response.UserLoginPostRes;
import com.ssafy.life4cut.api.response.UserRegisterPostRes;
import com.ssafy.life4cut.common.exception.handler.UserIdNotExistsException;
import com.ssafy.life4cut.common.util.mapper.UserMapper;
import com.ssafy.life4cut.db.datasource.LocalDatasource;
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

    /**
     *  회원 가입 Service/비즈니스 로직
     *
     * @param request UserRegisterPostReq
     * @return UserRegisterPostRes
     * @see UserRepository
     */
    @Override
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public UserRegisterPostRes register(UserRegisterPostReq request) {
        User user = UserMapper.toEntity(request);
        // TODO: Excpetion 구현하기
        userRepository.save(user);
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
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public UserLoginPostRes login(UserLoginPostReq request) {
        Optional<User> user = userRepository.findByUserId(request.getId());

        if (user.isPresent()) {
            return UserMapper.toLoginRes(user.get());
        } else {
            throw new UserIdNotExistsException("User ID already exists.");
        }
    }
}
