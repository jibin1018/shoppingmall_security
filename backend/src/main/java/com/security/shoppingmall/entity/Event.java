package com.security.shoppingmall.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "EVENTS")
@Getter @Setter
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "event_seq")
    @SequenceGenerator(name = "event_seq", sequenceName = "EVENT_SEQ", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    // [VULN] HTML 태그 그대로 저장 - XSS 가능
    @Column(length = 2000)
    private String description;

    @Column(length = 200)
    private String imageUrl;

    @Column
    private Integer discountRate;

    @Column(length = 20)
    private String startDate;

    @Column(length = 20)
    private String endDate;

    @Column(nullable = false)
    private Boolean active = true;
}
