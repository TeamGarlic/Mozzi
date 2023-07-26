package com.ssafy.life4cut.common.auth;

import java.io.Serializable;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Java Security Authentication을 이용하기 위한 CustomUserDetails
 * @see UserDetails
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomUserDetails implements UserDetails, Serializable {
    private String id;    // DB에서 PK 값
    private String userId;        // 로그인용 ID 값
    private String password;    // 비밀번호
    private String email;    //이메일
    private boolean emailVerified;    //이메일 인증 여부
    private boolean locked;    //계정 잠김 여부
    private String nickname;    //닉네임
    private Collection<GrantedAuthority> authorities;    //권한 목록

    /**
     * 해당 유저의 권한 목록
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    /**
     * 비밀번호
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * PK값
     */
    @Override
    public String getUsername() {
        return id;
    }

    /**
     * 계정 만료 여부
     * true : 만료 안됨
     * false : 만료
     * @return
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 계정 잠김 여부
     * true : 잠기지 않음
     * false : 잠김
     * @return
     */
    @Override
    public boolean isAccountNonLocked() {
        return locked;
    }

    /**
     * 비밀번호 만료 여부
     * true : 만료 안됨
     * false : 만료
     * @return
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 사용자 활성화 여부
     * ture : 활성화
     * false : 비활성화
     * @return
     */
    @Override
    public boolean isEnabled() {
        //이메일이 인증되어 있고 계정이 잠겨있지 않으면 true
        return (emailVerified && !locked);
    }
}
