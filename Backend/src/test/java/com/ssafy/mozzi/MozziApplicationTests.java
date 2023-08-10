package com.ssafy.mozzi;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.mozzi.api.service.EmailServiceImpl;

@SpringBootTest
class MozziApplicationTests {

    @Autowired
    EmailServiceImpl emailService;

    @Test
    void contextLoads() {
    }

    @Test
    void mailTest() {
        emailService.passwordReset("ssafy9woojeong@gmail.com", "1234");
    }
}
