package com.security.shoppingmall.service;

import com.security.shoppingmall.dto.LoginRequest;
import com.security.shoppingmall.dto.LoginResponse;
import com.security.shoppingmall.dto.RegisterRequest;
import com.security.shoppingmall.entity.User;
import com.security.shoppingmall.repository.UserRepository;
import com.security.shoppingmall.util.JwtUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        // [VULN] SQL Injection - 입력값을 문자열로 직접 연결
        // 공격 예시: username = ' OR '1'='1
        String sql = "SELECT * FROM USERS WHERE username = '" + request.getUsername()
                + "' AND password = '" + request.getPassword() + "'";

        @SuppressWarnings("unchecked")
        List<User> users = entityManager.createNativeQuery(sql, User.class).getResultList();

        if (users.isEmpty()) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        User user = users.get(0);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        return new LoginResponse(token, user.getId(), user.getUsername(), user.getRole());
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        // [VULN] 비밀번호 평문 저장 - 해싱 없음
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole("USER");

        userRepository.save(user);
    }
}
