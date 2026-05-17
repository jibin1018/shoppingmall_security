package com.security.shoppingmall.controller;

import com.security.shoppingmall.dto.LoginRequest;
import com.security.shoppingmall.dto.LoginResponse;
import com.security.shoppingmall.dto.RegisterRequest;
import com.security.shoppingmall.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "인증 API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "[VULN] SQL Injection 취약점 존재")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // [VULN] 로그인 시도 횟수 제한 없음 - Brute Force 가능
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @Operation(summary = "회원가입", description = "[VULN] 비밀번호 평문 저장")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }
}
