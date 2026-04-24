package com.smartcampus.api.dto;

import com.smartcampus.api.entity.Resource;
import com.smartcampus.api.entity.ResourceType;

public record ResourceResponseDto(
        Long id,
        String name,
        String description,
        ResourceType type,
        String location,
        Integer capacity,
        Double pricePerHour,
        Boolean available
) {
    public static ResourceResponseDto from(Resource resource) {
        return new ResourceResponseDto(
                resource.getId(),
                resource.getName(),
                resource.getDescription(),
                resource.getType(),
                resource.getLocation(),
                resource.getCapacity(),
                resource.getPricePerHour(),
                resource.getAvailable()
        );
    }
}
