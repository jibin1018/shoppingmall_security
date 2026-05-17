package com.security.shoppingmall.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductRequest {
    private String name;
    // [VULN] HTML 입력 허용 - XSS 페이로드 저장 가능
    private String description;
    private Integer price;
    private String imageUrl;
    private Integer stock;
    private String category;
}
