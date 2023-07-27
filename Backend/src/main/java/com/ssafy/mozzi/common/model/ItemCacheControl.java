package com.ssafy.mozzi.common.model;

import java.util.concurrent.TimeUnit;

import org.springframework.http.CacheControl;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Getter
@Component
public class ItemCacheControl {
    private final CacheControl cacheControl = CacheControl.maxAge(365, TimeUnit.DAYS)
        .noTransform()
        .mustRevalidate()
        .cachePublic();
}
