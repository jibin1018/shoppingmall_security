package com.security.shoppingmall.controller;

import com.security.shoppingmall.dto.UserResponse;
import com.security.shoppingmall.service.MypageService;
import com.security.shoppingmall.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
@Tag(name = "Mypage", description = "마이페이지 API")
public class MypageController {

    private final MypageService mypageService;
    private final JwtUtil jwtUtil;

    @GetMapping("/{userId}")
    @Operation(summary = "사용자 정보 조회", description = "[VULN] IDOR - 다른 사용자 ID로 타인 정보 조회 가능")
    public ResponseEntity<UserResponse> getMypage(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long userId) {

        // [VULN] 토큰의 userId와 요청 userId 일치 여부 확인하지 않음
        // 유효한 토큰만 있으면 임의의 userId 조회 가능
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("인증 토큰이 필요합니다.");
        }

        // 토큰 유효성만 확인 (소유권 확인 없음)
        String token = authHeader.substring(7);
        jwtUtil.parseToken(token);

        return ResponseEntity.ok(mypageService.getUserById(userId));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "사용자 정보 수정", description = "[VULN] IDOR - 다른 사용자 정보 수정 가능")
    public ResponseEntity<UserResponse> updateMypage(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {

        // [VULN] 마찬가지로 소유권 확인 없음
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("인증 토큰이 필요합니다.");
        }
        String token = authHeader.substring(7);
        jwtUtil.parseToken(token);

        return ResponseEntity.ok(mypageService.updateUser(userId, body.get("phone"), body.get("address")));
    }
}
