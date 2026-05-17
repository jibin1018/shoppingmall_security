package com.security.shoppingmall.service;

import com.security.shoppingmall.dto.UserResponse;
import com.security.shoppingmall.entity.User;
import com.security.shoppingmall.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MypageService {

    private final UserRepository userRepository;

    // [VULN] IDOR - 요청한 userId가 실제 인증된 사용자인지 확인하지 않음
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. id=" + userId));
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long userId, String phone, String address) {
        // [VULN] IDOR - 권한 확인 없이 타 사용자 정보 수정 가능
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. id=" + userId));
        user.setPhone(phone);
        user.setAddress(address);
        return new UserResponse(userRepository.save(user));
    }
}
