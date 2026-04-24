package com.smartcampus.api.service;

import com.smartcampus.api.entity.Resource;
import com.smartcampus.api.repository.ResourceRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Page<Resource> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable);
    }

    public Page<Resource> getAllAvailableResources(Pageable pageable) {
        return resourceRepository.findByAvailableTrue(pageable);
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource resourceDetails) {
        Resource resource = getResourceById(id);
        resource.setName(resourceDetails.getName());
        resource.setDescription(resourceDetails.getDescription());
        resource.setType(resourceDetails.getType());
        resource.setLocation(resourceDetails.getLocation());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setPricePerHour(resourceDetails.getPricePerHour());
        resource.setAmenities(resourceDetails.getAmenities());
        resource.setAvailable(resourceDetails.getAvailable());
        resource.setImageUrl(resourceDetails.getImageUrl());
        resource.setAvailableDays(resourceDetails.getAvailableDays());
        resource.setAvailableFrom(resourceDetails.getAvailableFrom());
        resource.setAvailableTo(resourceDetails.getAvailableTo());
        return resourceRepository.save(resource);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
