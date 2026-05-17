package com.security.shoppingmall.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterRequest {
    // [VULN] 입력값 검증 없음
    private String username;
    private String password;
    private String email;
    private String phone;
    private String address;
}
