package com.security.shoppingmall.service;

import com.security.shoppingmall.dto.ProductResponse;
import com.security.shoppingmall.entity.Product;
import com.security.shoppingmall.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchByName(String name) {
        return productRepository.findByNameContaining(name).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @PostConstruct
    public void initDummyData() {
        if (productRepository.count() > 0) return;

        String[] names = {"나이키 에어맥스", "아디다스 울트라부스트", "뉴발란스 990", "컨버스 척테일러", "반스 올드스쿨"};
        // [VULN] XSS 페이로드를 포함한 더미 상품 설명 (실제 공격 시뮬레이션용)
        String[] descs = {
            "최신 에어 쿠션으로 최고의 착용감을 제공합니다.",
            "초경량 소재로 제작된 러닝화입니다.",
            "클래식한 디자인의 생활방수 스니커즈.",
            "<img src=x onerror=\"alert('XSS')\"> 레트로 감성의 하이탑 스니커즈.",
            "스케이트보드 문화에서 탄생한 아이코닉 슈즈."
        };
        int[] prices = {189000, 219000, 259000, 99000, 109000};
        String[] categories = {"운동화", "러닝화", "운동화", "캐주얼", "캐주얼"};

        for (int i = 0; i < names.length; i++) {
            Product p = new Product();
            p.setName(names[i]);
            p.setDescription(descs[i]);
            p.setPrice(prices[i]);
            p.setStock(100);
            p.setCategory(categories[i]);
            p.setImageUrl("https://via.placeholder.com/300x200?text=" + names[i]);
            productRepository.save(p);
        }
    }
}
