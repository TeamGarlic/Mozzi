package com.ssafy.mozzi.common.util;

import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.ssafy.mozzi.common.auth.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MozziUtilImpl implements MozziUtil {
    private final JwtTokenProvider jwtTokenProvider;
    private final RandomGenerator random = RandomGeneratorFactory
        .getDefault().create(System.currentTimeMillis());

    @Override
    public long findUserIdByToken(String accessToken) {
        Authentication auth = jwtTokenProvider.getAuthentication(accessToken);
        UserDetails userDetails = (UserDetails)auth.getPrincipal();
        return Long.parseLong(userDetails.getUsername());
    }

    /**
     * 영문자/숫자로 구성된 length 만큼의 랜덤한 문자열을 만듭니다.
     *
     * @param length 생성할 문자열의 길이
     * @return 생성된 랜덤한 문자열
     */
    @Override
    public String generateString(int length, boolean includeSpecial) {
        StringBuilder sb = new StringBuilder();
        int[] rands
            = random.ints(length, 0, 62 + (includeSpecial ? 10 : 0))
            .toArray();
        for (int rand : rands) {
            if (rand < 10) {
                sb.append(rand);
            } else if (rand < 36) {
                sb.append((char)('a' + rand - 10));
            } else if (rand < 62) {
                sb.append((char)('A' + rand - 36));
            } else {
                sb.append((char)('!' + rand - 62));
            }
        }
        return sb.toString();
    }
}
