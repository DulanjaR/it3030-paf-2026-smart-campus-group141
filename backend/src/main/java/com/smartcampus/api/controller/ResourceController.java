package com.smartcampus.api.controller;

import com.smartcampus.api.entity.Resource;
import com.smartcampus.api.service.ResourceService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resources")
@AllArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    // GET all available resources (with pagination)
    @GetMapping
    public Page<Resource> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return resourceService.getAllAvailableResources(PageRequest.of(page, size));
    }

    // GET resource by ID
    @GetMapping("/{id}")
    public Resource getResource(@PathVariable Long id) {
        return resourceService.getResourceById(id);
    }

    // CREATE resource
    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    // UPDATE resource
    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable Long id, @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    // DELETE resource
    @DeleteMapping("/{id}")
    public String deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return "Resource deleted successfully";
    }
}