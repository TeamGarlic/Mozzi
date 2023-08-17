package com.ssafy.mozzi.common.auth;

import java.util.Base64;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.ssafy.mozzi.common.util.mapper.UserMapper;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.repository.remote.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${JWT_SECRET}")
    private String secretKey;

    private long tokenValidTime = 1000L * 60 * 60 * 24; // 일시적으로 개발을 위해 토큰 유효시간 늘려놓음
    private long refreshTokenValidTime = 1000L * 60 * 60 * 24 * 7; // 7일

    private final UserRepository userRepository;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    /**
     * Spting Security를 이용하기 위해 id를 String 형태로 받아온다.
     * @param id String
     * @return Jwt accessToken
     */
    public String createToken(String id) {
        Claims claims = Jwts.claims().setSubject(id);
        Date now = new Date();

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + tokenValidTime))
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }

    /**
     * refreshToken을 생성해준다.
     * @return refreshToken
     */
    public String createRefreshToken() {
        Date now = new Date();

        return Jwts.builder()
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + refreshTokenValidTime))
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }

    /**
     * accessToken을 입력받아 해당 유저의 Spring Security 에서 제공하는 Authentication 객체를 생성한다.
     * @param token String
     * @return Authentication 객체
     * @see CustomUserDetails
     * @see JwtAuthenticationFilter
     * @throws UsernameNotFoundException
     */
    public Authentication getAuthentication(String token) {
        Optional<User> user = userRepository.findById(Long.parseLong(getUserId(token)));

        if (user.isPresent()) {
            CustomUserDetails userDetails = UserMapper.toCustomUserDetails(user.get());
            return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
        } else {
            throw new UsernameNotFoundException("not found login id");
        }
    }

    /**
     * accessToken을 만들때 이용했던 id
     * @param token String
     * @return User의 pk를 String 형태로 반환
     */
    public String getUserId(String token) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
        } catch (ExpiredJwtException e) {
            return e.getClaims().getSubject();
        }
    }

    /**
     * 헤더에 전송된 Authorization에서 token을 가져옴
     * */
    public String resolveToken(HttpServletRequest req) {
        return req.getHeader("Authorization");
    }

    /**
     * 해당 토큰이 만료되었으면 true 아니면 false 반환
     * @param token String
     */
    public boolean validateTokenExceptExpiration(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
