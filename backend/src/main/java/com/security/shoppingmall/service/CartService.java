package com.security.shoppingmall.service;

import com.security.shoppingmall.dto.CartItemRequest;
import com.security.shoppingmall.dto.CartItemResponse;
import com.security.shoppingmall.entity.CartItem;
import com.security.shoppingmall.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;

    public List<CartItemResponse> getCart(Long userId) {
        return cartItemRepository.findByUserId(userId).stream()
                .map(CartItemResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemResponse addToCart(Long userId, CartItemRequest request) {
        // 이미 담긴 상품이면 수량 증가
        return cartItemRepository.findByUserIdAndProductId(userId, request.getProductId())
                .map(item -> {
                    // [VULN] 음수 수량도 허용
                    item.setQuantity(item.getQuantity() + request.getQuantity());
                    return new CartItemResponse(cartItemRepository.save(item));
                })
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setUserId(userId);
                    item.setProductId(request.getProductId());
                    item.setQuantity(request.getQuantity());
                    return new CartItemResponse(cartItemRepository.save(item));
                });
    }

    @Transactional
    public CartItemResponse updateQuantity(Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("장바구니 항목을 찾을 수 없습니다."));
        item.setQuantity(quantity);
        return new CartItemResponse(cartItemRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
