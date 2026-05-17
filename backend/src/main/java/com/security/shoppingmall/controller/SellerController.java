package com.security.shoppingmall.controller;

import com.security.shoppingmall.dto.ProductRequest;
import com.security.shoppingmall.dto.ProductResponse;
import com.security.shoppingmall.entity.Product;
import com.security.shoppingmall.repository.ProductRepository;
import com.security.shoppingmall.service.ProductService;
import com.security.shoppingmall.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@Tag(name = "Seller", description = "판매자 API")
public class SellerController {

    private final ProductRepository productRepository;
    private final ProductService productService;
    private final JwtUtil jwtUtil;

    // [VULN] alg:none JWT로 role 클레임을 "SELLER"로 위조하여 접근 가능
    private Long validateSellerToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new RuntimeException("인증이 필요합니다.");
        Claims claims = jwtUtil.parseToken(authHeader.substring(7));
        String role = (String) claims.get("role");
        if (!"SELLER".equals(role))
            throw new RuntimeException("판매자 권한이 필요합니다.");
        return claims.get("userId", Long.class);
    }

    @GetMapping("/stats")
    @Operation(summary = "판매자 통계")
    public ResponseEntity<Map<String, Object>> getStats(@RequestHeader("Authorization") String auth) {
        Long sellerId = validateSellerToken(auth);
        List<Product> products = productRepository.findBySellerId(sellerId);
        Map<String, Object> stats = new HashMap<>();
        stats.put("productCount", products.size());
        stats.put("totalStock", products.stream().mapToInt(p -> p.getStock() != null ? p.getStock() : 0).sum());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/products")
    @Operation(summary = "내 상품 목록")
    public ResponseEntity<List<ProductResponse>> getMyProducts(@RequestHeader("Authorization") String auth) {
        Long sellerId = validateSellerToken(auth);
        return ResponseEntity.ok(productService.getProductsBySeller(sellerId));
    }

    @PostMapping("/products")
    @Operation(summary = "상품 등록", description = "[VULN] XSS 페이로드 저장 가능 (description HTML 미필터링)")
    public ResponseEntity<ProductResponse> createProduct(
            @RequestHeader("Authorization") String auth,
            @RequestBody ProductRequest request) {
        Long sellerId = validateSellerToken(auth);
        Product p = new Product();
        p.setName(request.getName());
        // [VULN] HTML 태그 미필터링 - Stored XSS
        p.setDescription(request.getDescription());
        p.setPrice(request.getPrice());
        p.setImageUrl(request.getImageUrl());
        p.setStock(request.getStock() != null ? request.getStock() : 0);
        p.setCategory(request.getCategory());
        p.setSellerId(sellerId);
        return ResponseEntity.ok(new ProductResponse(productRepository.save(p)));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "상품 수정", description = "[VULN] IDOR - 다른 판매자의 상품 ID로 접근하면 수정 가능 (소유권 미확인)")
    public ResponseEntity<ProductResponse> updateProduct(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id,
            @RequestBody ProductRequest request) {
        validateSellerToken(auth);
        // [VULN] IDOR: sellerId 소유권 검증 없이 모든 상품 수정 가능
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
    @Operation(summary = "상품 삭제", description = "[VULN] IDOR - 다른 판매자의 상품도 삭제 가능 (소유권 미확인)")
    public ResponseEntity<Void> deleteProduct(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id) {
        validateSellerToken(auth);
        // [VULN] IDOR: 소유권 검증 없이 모든 상품 삭제 가능
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
