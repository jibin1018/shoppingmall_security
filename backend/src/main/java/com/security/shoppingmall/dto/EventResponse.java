package com.security.shoppingmall.dto;

import com.security.shoppingmall.entity.Event;
import lombok.Getter;

@Getter
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private Integer discountRate;
    private String startDate;
    private String endDate;
    private Boolean active;

    public EventResponse(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.imageUrl = event.getImageUrl();
        this.discountRate = event.getDiscountRate();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.active = event.getActive();
    }
}
