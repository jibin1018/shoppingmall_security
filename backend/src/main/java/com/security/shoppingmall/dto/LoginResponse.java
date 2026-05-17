package com.security.shoppingmall.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    // [VULN] 응답에 userId 포함 - IDOR 공격 시 타겟 ID로 활용 가능
    private Long userId;
    private String username;
    private String role;

    public LoginResponse(String token, Long userId, String username, String role) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.role = role;
    }
}
