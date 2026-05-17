package com.security.shoppingmall.service;

import com.security.shoppingmall.dto.OrderRequest;
import com.security.shoppingmall.dto.OrderResponse;
import com.security.shoppingmall.entity.Order;
import com.security.shoppingmall.entity.OrderItem;
import com.security.shoppingmall.repository.CartItemRepository;
import com.security.shoppingmall.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        Order order = new Order();
        order.setUserId(userId);
        // [VULN] 클라이언트 전송 금액 그대로 저장 - 실제 상품 가격 검증 없음
        order.setTotalPrice(request.getTotalPrice());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus("PENDING");

        request.getItems().forEach(req -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(req.getProductId());
            item.setProductName(req.getProductName());
            // [VULN] 클라이언트 전송 가격 그대로 사용
            item.setPrice(req.getPrice());
            item.setQuantity(req.getQuantity());
            order.getItems().add(item);
        });

        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);
        return new OrderResponse(saved);
    }

    // [VULN] IDOR - 요청한 userId와 주문의 userId를 대조하지 않음
    public OrderResponse getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .map(OrderResponse::new)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다. id=" + orderId));
    }

    public List<OrderResponse> getMyOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }
}
