package com.security.shoppingmall.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {
    // [VULN] 입력값 검증 없음 - SQL 메타문자 그대로 허용
    private String username;
    private String password;
}
