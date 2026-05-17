package com.security.shoppingmall.dto;

import com.security.shoppingmall.entity.CartItem;
import lombok.Getter;

@Getter
public class CartItemResponse {
    private Long id;
    private Long productId;
    private Integer quantity;

    public CartItemResponse(CartItem item) {
        this.id = item.getId();
        this.productId = item.getProductId();
        this.quantity = item.getQuantity();
    }
}
