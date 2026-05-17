package com.security.shoppingmall.dto;

import com.security.shoppingmall.entity.Product;
import lombok.Getter;

@Getter
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Integer price;
    private String imageUrl;
    private Integer stock;
    private String category;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.imageUrl = product.getImageUrl();
        this.stock = product.getStock();
        this.category = product.getCategory();
    }
}
