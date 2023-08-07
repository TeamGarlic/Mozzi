package com.ssafy.mozzi.api.service;

public interface EmailService {
    void passwordReset(String email, String password);
}
