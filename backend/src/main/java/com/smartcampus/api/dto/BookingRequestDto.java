package com.smartcampus.api.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingRequestDto(
        @NotNull(message = "Resource is required")
        Long resourceId,

        @NotNull(message = "Date is required")
        @FutureOrPresent(message = "Booking date cannot be in the past")
        LocalDate date,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotBlank(message = "Purpose is required")
        String purpose
) {
}
