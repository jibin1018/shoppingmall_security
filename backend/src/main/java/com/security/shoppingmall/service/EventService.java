package com.security.shoppingmall.service;

import com.security.shoppingmall.dto.EventResponse;
import com.security.shoppingmall.entity.Event;
import com.security.shoppingmall.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventResponse> getActiveEvents() {
        return eventRepository.findByActiveTrue().stream()
                .map(EventResponse::new)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventResponse::new)
                .collect(Collectors.toList());
    }

    public EventResponse getEvent(Long id) {
        return eventRepository.findById(id)
                .map(EventResponse::new)
                .orElseThrow(() -> new RuntimeException("이벤트를 찾을 수 없습니다."));
    }

    @Transactional
    public EventResponse createEvent(Event event) {
        return new EventResponse(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}
