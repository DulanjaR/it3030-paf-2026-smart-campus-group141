package com.smartcampus.api.controller;

import com.smartcampus.api.entity.Booking;
import com.smartcampus.api.entity.BookingStatus;
import com.smartcampus.api.service.BookingService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody CreateBookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(
                request.getUserId(),
                request.getResourceId(),
                request.getStartTime(),
                request.getEndTime(),
                request.getReason()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(booking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserBookings(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<BookingResponse> response = bookingService
                .getUserBookings(userId, PageRequest.of(page, size))
                .map(this::toResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(toResponse(bookingService.getBookingById(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(toResponse(bookingService.cancelBooking(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
            booking.getId(),
            booking.getUser() != null ? booking.getUser().getId() : null,
            booking.getUser() != null ? booking.getUser().getFirstName() + " " + booking.getUser().getLastName() : null,
            booking.getResource() != null ? booking.getResource().getId() : null,
            booking.getResource() != null ? booking.getResource().getName() : null,
            booking.getStartTime(),
            booking.getEndTime(),
            booking.getStatus() != null ? booking.getStatus().name() : null,
            booking.getReason(),
            booking.getTotalPrice(),
            booking.getRejectionReason(),
            booking.getCreatedAt(),
            booking.getUpdatedAt()
        );
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingResponse {
        private Long id;
        private Long userId;
        private String userName;
        private Long resourceId;
        private String resourceName;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String status;
        private String reason;
        private Double totalPrice;
        private String rejectionReason;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateBookingRequest {
        private Long userId;
        private Long resourceId;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String reason;
    }
}