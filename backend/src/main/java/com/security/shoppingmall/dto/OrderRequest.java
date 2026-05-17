package com.security.shoppingmall.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class OrderRequest {
    private List<OrderItemRequest> items;
    // [VULN] 클라이언트 계산 총액 - 서버 검증 없음
    private Integer totalPrice;
    private String deliveryAddress;
    private String paymentMethod;
}
