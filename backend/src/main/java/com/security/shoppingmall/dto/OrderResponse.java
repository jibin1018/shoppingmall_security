package com.security.shoppingmall.dto;

import com.security.shoppingmall.entity.Order;
import com.security.shoppingmall.entity.OrderItem;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class OrderResponse {
    private Long id;
    private Long userId;
    private Integer totalPrice;
    private String status;
    private String deliveryAddress;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.userId = order.getUserId();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus();
        this.deliveryAddress = order.getDeliveryAddress();
        this.paymentMethod = order.getPaymentMethod();
        this.createdAt = order.getCreatedAt();
        this.items = order.getItems().stream().map(OrderItemDto::new).collect(Collectors.toList());
    }

    @Getter
    public static class OrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private Integer price;
        private Integer quantity;

        public OrderItemDto(OrderItem item) {
            this.id = item.getId();
            this.productId = item.getProductId();
            this.productName = item.getProductName();
            this.price = item.getPrice();
            this.quantity = item.getQuantity();
        }
    }
}
