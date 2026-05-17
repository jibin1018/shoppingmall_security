package com.security.shoppingmall.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CartItemRequest {
    private Long productId;
    // [VULN] 음수/0 수량 검증 없음
    private Integer quantity;
}
