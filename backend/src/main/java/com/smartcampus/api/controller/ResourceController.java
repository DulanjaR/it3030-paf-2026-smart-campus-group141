package com.smartcampus.api.controller;

import com.smartcampus.api.dto.ResourceResponseDto;
import com.smartcampus.api.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDto>> getResources() {
        List<ResourceResponseDto> resources = resourceService.getAllResources()
                .stream()
                .map(ResourceResponseDto::from)
                .toList();

        return ResponseEntity.ok(resources);
    }
}
