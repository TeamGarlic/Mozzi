package com.ssafy.mozzi.common.model;

import java.util.concurrent.TimeUnit;

import org.springframework.http.CacheControl;

public class APICacheControl {
    public static final CacheControl usePublicCache = CacheControl.maxAge(365, TimeUnit.DAYS)
        .sMaxAge(365, TimeUnit.DAYS)
        .cachePublic();

    public static final CacheControl usePrivateCache = CacheControl.maxAge(365, TimeUnit.DAYS).cachePrivate();

    public static final CacheControl noCache = CacheControl.noStore();

    public static final CacheControl temporalCache = CacheControl.maxAge(20, TimeUnit.MINUTES)
        .sMaxAge(20, TimeUnit.MINUTES);
}
