package com.smartcampus.api.dto;

import com.smartcampus.api.entity.TicketStatus;
import com.smartcampus.api.entity.TicketPriority;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTicketStatusRequest {
    
    @NotNull(message = "Status is required")
    private TicketStatus status;
}
