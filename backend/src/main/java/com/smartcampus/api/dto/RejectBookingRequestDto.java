package com.smartcampus.api.dto;

import jakarta.validation.constraints.NotBlank;

public record RejectBookingRequestDto(
        @NotBlank(message = "Rejection reason is required")
        String rejectionReason
) {
}
