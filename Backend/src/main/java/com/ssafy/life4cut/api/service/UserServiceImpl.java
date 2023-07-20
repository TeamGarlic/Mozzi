package com.ssafy.life4cut.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.life4cut.api.request.UserRegisterPostReq;
import com.ssafy.life4cut.api.response.UserRegisterPostRes;
import com.ssafy.life4cut.common.util.mapper.UserMapper;
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
    @Transactional
    public UserRegisterPostRes register(UserRegisterPostReq request) {
        User user = UserMapper.toEntity(request);
        // TODO: Excpetion 구현하기
        userRepository.save(user);
        return UserMapper.toRegistRes(user);
    }
}
