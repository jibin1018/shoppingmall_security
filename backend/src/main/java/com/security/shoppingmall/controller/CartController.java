package com.security.shoppingmall.controller;

import com.security.shoppingmall.dto.CartItemRequest;
import com.security.shoppingmall.dto.CartItemResponse;
import com.security.shoppingmall.service.CartService;
import com.security.shoppingmall.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "장바구니 API")
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;

    private Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new RuntimeException("인증이 필요합니다.");
        return jwtUtil.getUserIdFromToken(authHeader.substring(7));
    }

    @GetMapping
    @Operation(summary = "장바구니 조회")
    public ResponseEntity<List<CartItemResponse>> getCart(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(cartService.getCart(extractUserId(auth)));
    }

    @PostMapping
    @Operation(summary = "장바구니 추가", description = "[VULN] 음수 수량 허용")
    public ResponseEntity<CartItemResponse> addToCart(
            @RequestHeader("Authorization") String auth,
            @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(extractUserId(auth), request));
    }

    @PutMapping("/{itemId}")
    @Operation(summary = "수량 변경", description = "[VULN] 소유권 확인 없음")
    public ResponseEntity<CartItemResponse> updateQuantity(
            @PathVariable Long itemId,
            @RequestBody CartItemRequest request) {
        // [VULN] itemId가 요청자 소유인지 확인하지 않음
        return ResponseEntity.ok(cartService.updateQuantity(itemId, request.getQuantity()));
    }

    @DeleteMapping("/{itemId}")
    @Operation(summary = "항목 삭제")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        cartService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
