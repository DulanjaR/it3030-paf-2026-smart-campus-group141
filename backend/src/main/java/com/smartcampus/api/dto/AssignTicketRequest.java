package com.smartcampus.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignTicketRequest {
    
    @NotBlank(message = "Technician email is required")
    @Email(message = "Technician email must be valid")
    private String technicianEmail;
}
