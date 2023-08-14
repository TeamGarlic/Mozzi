package com.ssafy.mozzi.common.util;

public interface MozziUtil {
    long findUserIdByToken(String accessToken);

    String generateString(int length, boolean includeSpecial);

    String generateKoreanToken();
}
