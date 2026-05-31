package com.enterprise.erm.common.exception;

import lombok.Getter;

/**
 * Global application-wide runtime business exception.
 * Decoupled from Spring Web packages to support high architectural cohesion.
 */
@Getter
public class BusinessException extends RuntimeException {

    private final int status;
    private final String errorCode;

    public BusinessException(String message, int status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public BusinessException(String message, int status) {
        super(message);
        this.status = status;
        this.errorCode = "INTERNAL_BUSINESS_ERROR";
    }
}
