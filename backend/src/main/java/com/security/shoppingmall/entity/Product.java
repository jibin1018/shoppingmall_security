package com.security.shoppingmall.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "PRODUCTS")
@Getter @Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @SequenceGenerator(name = "product_seq", sequenceName = "PRODUCT_SEQ", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    // [VULN] HTML 태그를 그대로 저장 - 프론트에서 dangerouslySetInnerHTML로 렌더링되어 XSS 가능
    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Integer price;

    @Column(length = 200)
    private String imageUrl;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 50)
    private String category;

    // 등록한 판매자 userId (null이면 관리자 등록 상품)
    @Column
    private Long sellerId;
}
