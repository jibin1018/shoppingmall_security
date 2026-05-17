package com.security.shoppingmall.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "USERS")
@Getter @Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "USER_SEQ", allocationSize = 1)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    // [VULN] 비밀번호 평문 저장 (MD5조차 사용하지 않음)
    @Column(nullable = false, length = 255)
    private String password;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 200)
    private String address;

    // [VULN] 역할을 문자열로 단순 저장 - 검증 로직 없음
    @Column(nullable = false, length = 20)
    private String role = "USER";
}
