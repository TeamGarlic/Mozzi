package com.ssafy.mozzi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 스케쥴러 활성화를 위한 클래스, 아래 설정만으로도 ScheduleTasks 안에 있는 Task들이 주기적으로 실행된다.
 * @see com.ssafy.mozzi.common.scheduler.ScheduleTasks
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Scheduler 활성화를 위한 설정 클래스
}
