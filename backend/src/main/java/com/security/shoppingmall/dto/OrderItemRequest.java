package com.security.shoppingmall.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemRequest {
    private Long productId;
    private String productName;
    // [VULN] 클라이언트 전송 가격 - 서버에서 실제 가격과 대조하지 않음
    private Integer price;
    private Integer quantity;
}
