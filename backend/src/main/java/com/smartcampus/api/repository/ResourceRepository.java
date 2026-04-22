package com.smartcampus.api.repository;

import com.smartcampus.api.entity.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Page<Resource> findByAvailableTrue(Pageable pageable);
    Page<Resource> findByTypeAndAvailableTrue(String type, Pageable pageable);
}
