package com.ssafy.mozzi.common.util;

import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.ssafy.mozzi.common.auth.JwtTokenProvider;
import com.ssafy.mozzi.common.exception.MozziAPIErrorCode;
import com.ssafy.mozzi.common.exception.handler.NotFoundException;
import com.ssafy.mozzi.common.exception.handler.UnAuthorizedException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MozziUtilImpl implements MozziUtil {
    private final JwtTokenProvider jwtTokenProvider;
    private final RandomGenerator random = RandomGeneratorFactory
        .getDefault().create(System.currentTimeMillis());

    private static final String[][] seeds = {
        {
            "완전히", "매우", "정확히", "틀림없이", "진지하게", "운좋게도", "완벽하게", "상당히", "합리적으로", "대단히", "강렬하게", "활발하게", "적극적으로", "그야말로",
            "솔직히", "적절하게", "거의"
        },
        {
            "행복한", "슬픈", "우울한", "쓸쓸한", "무거운", "따뜻한", "작은", "큰", "맛있는", "달콤한", "어려운", "쉬운", "재미있는", "훌륭한", "잘생긴", "예쁜",
            "귀여운", "매력적인", "편리한", "친절한", "순수한", "청결한", "상냥한", "예의바른", "높은", "먼", "정직한", "성실한", "공정한", "버릇없는", 
            "얇은", "뚱뚱한", "매끄러운", "유창한", "부드러운", "우아한", "즐거운", "좋은", "이상한", "눈에띄는", "유명한", "어두운", "밝은", "부끄러운", "수줍은",
            "긴", "짧은", "명백한", "특별한", "촌스러운", "어리석은", "지루한", "단조로운", "피곤한", "지혜로운", "적극적인", "솔직한", "흥미있는", "고통스러운",
            "기분이좋은", "신성한", "무서워하는", "놀란", "순결한", "간단한", "융통성", "심각한", "날카로운", "활발한", "가느다란", "약한", "무례한", "성가신", "격분한",
            "화난", "자연의", "뜨거운", "쌀쌀한", "무서운", "형편없는", "어색한", "가난한", "가엾은", "하찮은", "뉘우치는", "실망한", "대담한", "용감한", "화려한",
            "건방진", "강력한", "아름다운", "사랑스러운", "복잡한", "곧은", "철저한", "보수적인", "진보적인", "수동적인"
        },
        {
            "토끼", "강아지", "뱀", "새", "호랑이", "사자", "스컹크", "곰", "팬더", "말", "양", "꿩", "쥐", "닭", "병아리", "망아지", "고양이", "코끼리",
            "물고기", "해파리", "고래", "상어", "말미잘", "사슴", "이구아나", "도마뱀", "햄스터", "페릿", "거북", "기니피그", "원숭이", "개구리", "올챙이", "돼지",
            "사슴벌레", "장수풍댕이", "하늘소", "달팽이", "카멜레온", "개미", "나비", "다람쥐", "고슴도치", "오리", "개", "토끼", "뱀", "새",
            "코끼리", "너구리", "고양이", "다람쥐", "노루", "사슴", "청설모", "말", "얼룩말", "낙타", "개구리", "물고기", "호랑이", "사자", "표범", "치타",
            "타조", "거북이", "자라", "문어", "오징어", "병아리", "닭", "소", "개미", "소금쟁이", "영양", "맘모스", "바다사자",
            "고래", "돌고래", "바다표범", "나방", "박쥐", "반딧불이", "올빼미", "부엉이", "말", "나비", "순록", "양", "기린", "하마"
        }
    };

    /**
     * User의 Access Token을 받아 id(index)를 반환합니다.
     * @param accessToken JWT Token
     * @return user index of access token
     * @throws UnAuthorizedException (Invalid Access Token, 17)
     * @throws com.ssafy.mozzi.common.exception.handler.NotFoundException (UserIdNotExists, 2)
     */
    @Override
    public long findUserIdByToken(String accessToken) {
        try {
            if (!jwtTokenProvider.validateTokenExceptExpiration(accessToken)) {
                throw new UnAuthorizedException(MozziAPIErrorCode.InvalidAccessToken, "Access token is invalid");
            }

            Authentication auth = jwtTokenProvider.getAuthentication(accessToken);
            UserDetails userDetails = (UserDetails)auth.getPrincipal();
            return Long.parseLong(userDetails.getUsername());
        } catch (UsernameNotFoundException exception) {
            throw new NotFoundException(MozziAPIErrorCode.UserIdNotExists, "There is no user with access token");
        }
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

    /**
     * seed를 이용해서 한글 랜덤 문자열을 만듭니다.
     */
    @Override
    public String generateKoreanToken() {
        StringBuilder sb = new StringBuilder();
        for (String[] seed : seeds) {
            sb.append(seed[random.nextInt(seed.length)]);
        }
        return sb.toString();
    }
}
