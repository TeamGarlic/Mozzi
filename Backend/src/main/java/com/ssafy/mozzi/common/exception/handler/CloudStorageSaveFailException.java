package com.ssafy.mozzi.common.exception.handler;

public class CloudStorageSaveFailException extends RuntimeException {
    public CloudStorageSaveFailException(String message) {
        super(message);
    }
}
