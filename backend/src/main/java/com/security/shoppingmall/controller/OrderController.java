package com.security.shoppingmall.controller;

import com.security.shoppingmall.dto.OrderRequest;
import com.security.shoppingmall.dto.OrderResponse;
import com.security.shoppingmall.service.OrderService;
import com.security.shoppingmall.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "주문 API")
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    private Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new RuntimeException("인증이 필요합니다.");
        return jwtUtil.getUserIdFromToken(authHeader.substring(7));
    }

    @PostMapping
    @Operation(summary = "주문 생성", description = "[VULN] 가격 변조 - totalPrice 서버 검증 없음")
    public ResponseEntity<OrderResponse> createOrder(
            @RequestHeader("Authorization") String auth,
            @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(extractUserId(auth), request));
    }

    @GetMapping("/my")
    @Operation(summary = "내 주문 목록")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(orderService.getMyOrders(extractUserId(auth)));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "주문 상세", description = "[VULN] IDOR - 타인 주문 조회 가능")
    public ResponseEntity<OrderResponse> getOrder(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable Long orderId) {
        // [VULN] 토큰의 userId와 주문의 userId 일치 여부 미확인
        if (auth != null && auth.startsWith("Bearer ")) jwtUtil.parseToken(auth.substring(7));
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }
}
