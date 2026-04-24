package com.smartcampus.api.dto;

import com.smartcampus.api.entity.Booking;
import com.smartcampus.api.entity.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record BookingResponseDto(
        Long id,
        Long resourceId,
        String resourceName,
        Long userId,
        String userName,
        String userEmail,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        String purpose,
        BookingStatus status,
        String rejectionReason,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static BookingResponseDto from(Booking booking) {
        return new BookingResponseDto(
                booking.getId(),
                booking.getResource().getId(),
                booking.getResource().getName(),
                booking.getUser().getId(),
                booking.getUser().getFirstName() + " " + booking.getUser().getLastName(),
                booking.getUser().getEmail(),
                booking.getBookingDate(),
                booking.getStartTime().toLocalTime(),
                booking.getEndTime().toLocalTime(),
                booking.getPurpose(),
                booking.getStatus(),
                booking.getRejectionReason(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
