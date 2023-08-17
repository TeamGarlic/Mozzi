package com.ssafy.mozzi.common.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.mozzi.api.service.BoothService;
import com.ssafy.mozzi.db.datasource.LocalDatasource;
import com.ssafy.mozzi.db.entity.local.Booth;
import com.ssafy.mozzi.db.repository.local.BoothRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 스케쥴러 태스크들의 모음
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduleTasks {
    private final BoothRepository boothRepository;
    private final BoothService boothService;

    /**
     * 매 10분마다 생성된지 1시간 된 booth 를 삭제해준다.
     * @see BoothService
     */
    @Scheduled(fixedRate = 1000 * 60 * 10) // 10분
    @Transactional(transactionManager = LocalDatasource.TRANSACTION_MANAGER)
    public void sessionGarbageCollector() throws Exception {
        List<Booth> booths = boothRepository.findAll();

        for (Booth booth : booths) {
            if (booth.getCreatedAt().compareTo(LocalDateTime.now().plusHours(1)) > 0) {
                try {
                    boothService.deleteBooth(booth.getSessionId());
                } catch (Exception e) {
                    log.error("[BoothScheduler] :{}", e.getMessage());
                }
            }
        }
    }
}
