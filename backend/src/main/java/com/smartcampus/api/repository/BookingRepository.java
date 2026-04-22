package com.smartcampus.api.repository;

import com.smartcampus.api.entity.Booking;
import com.smartcampus.api.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByUserId(Long userId, Pageable pageable);
    Page<Booking> findByResourceId(Long resourceId, Pageable pageable);
    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);
    List<Booking> findByResourceIdAndStartTimeBeforeAndEndTimeAfter(
        Long resourceId, LocalDateTime endTime, LocalDateTime startTime);
}
