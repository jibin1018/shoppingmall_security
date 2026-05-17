package com.security.shoppingmall.controller;

import com.security.shoppingmall.dto.EventResponse;
import com.security.shoppingmall.dto.OrderResponse;
import com.security.shoppingmall.dto.ProductRequest;
import com.security.shoppingmall.dto.ProductResponse;
import com.security.shoppingmall.dto.UserResponse;
import com.security.shoppingmall.entity.Event;
import com.security.shoppingmall.entity.Product;
import com.security.shoppingmall.repository.OrderRepository;
import com.security.shoppingmall.repository.ProductRepository;
import com.security.shoppingmall.repository.UserRepository;
import com.security.shoppingmall.service.EventService;
import com.security.shoppingmall.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "관리자 API")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final EventService eventService;
    private final JwtUtil jwtUtil;

    // [VULN] role 확인 없이 토큰 존재만 확인 - 일반 사용자도 접근 가능
    private void validateToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new RuntimeException("인증이 필요합니다.");
        jwtUtil.parseToken(authHeader.substring(7));
    }

    @GetMapping("/stats")
    @Operation(summary = "대시보드 통계", description = "[VULN] ADMIN role 미확인")
    public ResponseEntity<Map<String, Object>> getStats(@RequestHeader("Authorization") String auth) {
        validateToken(auth);
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalRevenue", orderRepository.findAll().stream()
                .mapToInt(o -> o.getTotalPrice() != null ? o.getTotalPrice() : 0).sum());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @Operation(summary = "전체 회원 목록", description = "[VULN] ADMIN role 미확인 - 비밀번호 포함 전체 노출")
    public ResponseEntity<List<UserResponse>> getUsers(@RequestHeader("Authorization") String auth) {
        validateToken(auth);
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(UserResponse::new).collect(Collectors.toList()));
    }

    @PutMapping("/users/{id}/role")
    @Operation(summary = "회원 권한 변경", description = "[VULN] ADMIN role 미확인")
    public ResponseEntity<UserResponse> updateRole(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        validateToken(auth);
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setRole(body.get("role"));
        if (body.containsKey("brandName")) user.setBrandName(body.get("brandName"));
        return ResponseEntity.ok(new UserResponse(userRepository.save(user)));
    }

    @GetMapping("/orders")
    @Operation(summary = "전체 주문 목록", description = "[VULN] ADMIN role 미확인")
    public ResponseEntity<List<OrderResponse>> getOrders(@RequestHeader("Authorization") String auth) {
        validateToken(auth);
        return ResponseEntity.ok(orderRepository.findAll().stream()
                .map(OrderResponse::new).collect(Collectors.toList()));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "주문 상태 변경")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        validateToken(auth);
        var order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));
        order.setStatus(body.get("status"));
        return ResponseEntity.ok(new OrderResponse(orderRepository.save(order)));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "상품 수정")
    public ResponseEntity<ProductResponse> updateProduct(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id,
            @RequestBody ProductRequest request) {
        validateToken(auth);
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        if (request.getName() != null) p.setName(request.getName());
        if (request.getDescription() != null) p.setDescription(request.getDescription());
        if (request.getPrice() != null) p.setPrice(request.getPrice());
        if (request.getImageUrl() != null) p.setImageUrl(request.getImageUrl());
        if (request.getStock() != null) p.setStock(request.getStock());
        if (request.getCategory() != null) p.setCategory(request.getCategory());
        return ResponseEntity.ok(new ProductResponse(productRepository.save(p)));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "상품 삭제")
    public ResponseEntity<Void> deleteProduct(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id) {
        validateToken(auth);
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/events")
    @Operation(summary = "이벤트 등록", description = "[VULN] XSS 페이로드 저장 가능")
    public ResponseEntity<EventResponse> createEvent(
            @RequestHeader("Authorization") String auth,
            @RequestBody Event event) {
        validateToken(auth);
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @DeleteMapping("/events/{id}")
    @Operation(summary = "이벤트 삭제")
    public ResponseEntity<Void> deleteEvent(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id) {
        validateToken(auth);
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
