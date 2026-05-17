package com.security.shoppingmall.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        // [VULN] 스택트레이스 전체를 응답에 포함 - 내부 구조 노출
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));

        Map<String, Object> body = new HashMap<>();
        body.put("error", e.getMessage());
        // [VULN] 서버 내부 정보 노출
        body.put("stackTrace", sw.toString());
        body.put("exceptionClass", e.getClass().getName());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e) {
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));

        Map<String, Object> body = new HashMap<>();
        body.put("error", e.getMessage());
        body.put("stackTrace", sw.toString());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
