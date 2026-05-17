package com.security.shoppingmall.dto;

import com.security.shoppingmall.entity.User;
import lombok.Getter;

@Getter
public class UserResponse {
    private Long id;
    private String username;
    // [VULN] 민감 정보 노출 - 비밀번호를 응답에 포함
    private String password;
    private String email;
    private String phone;
    private String address;
    private String role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();  // [VULN]
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.role = user.getRole();
    }
}
