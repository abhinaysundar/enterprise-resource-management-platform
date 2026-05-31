package com.enterprise.erm.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Global application-wide runtime business exception.
 */
@Getter
public class BusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public BusinessException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.errorCode = "INTERNAL_BUSINESS_ERROR";
    }
}
