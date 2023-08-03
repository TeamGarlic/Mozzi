package com.ssafy.mozzi.common.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.ssafy.mozzi.common.auth.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MozziUtilImpl implements MozziUtil {
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public long findUserIdByToken(String accessToken) {
        Authentication auth = jwtTokenProvider.getAuthentication(accessToken);
        UserDetails userDetails = (UserDetails)auth.getPrincipal();
        return Long.parseLong(userDetails.getUsername());
    }
}
