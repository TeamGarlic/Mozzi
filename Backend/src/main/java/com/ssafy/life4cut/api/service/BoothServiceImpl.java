package com.ssafy.life4cut.api.service;

import org.springframework.stereotype.Service;

import com.ssafy.life4cut.db.entity.local.Booth;
import com.ssafy.life4cut.db.repository.local.BoothRepository;

import lombok.RequiredArgsConstructor;

// TODO: test code for h2. need to change it. (it is just basic check code)
@Service
@RequiredArgsConstructor
public class BoothServiceImpl implements BoothService {
    private final BoothRepository boothRepository;

    @Override
    public boolean join(String sessionId) {
        Booth booth = Booth.builder().sessionId(sessionId).build();
        boothRepository.save(booth);
        if (booth.getId() == 0)
            throw new RuntimeException();
        return true;
    }
}
