package com.smartcampus.api.service;

import com.smartcampus.api.entity.*;
import com.smartcampus.api.repository.BookingRepository;
import com.smartcampus.api.repository.ResourceRepository;
import com.smartcampus.api.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    
    public Page<Booking> getUserBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable);
    }
    
    public Page<Booking> getResourceBookings(Long resourceId, Pageable pageable) {
        return bookingRepository.findByResourceId(resourceId, pageable);
    }
    
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public Booking createBooking(Long userId, Long resourceId, LocalDateTime startTime, 
                                LocalDateTime endTime, String reason) {
        // Check for conflicts
        if (hasConflict(resourceId, startTime, endTime)) {
            throw new RuntimeException("Resource is not available during the requested time");
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Resource resource = resourceRepository.findById(resourceId)
            .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        // Calculate total price
        long hours = java.time.temporal.ChronoUnit.HOURS.between(startTime, endTime);
        Double totalPrice = hours * resource.getPricePerHour();
        
        Booking booking = Booking.builder()
            .user(user)
            .resource(resource)
            .startTime(startTime)
            .endTime(endTime)
            .status(BookingStatus.PENDING)
            .reason(reason)
            .totalPrice(totalPrice)
            .build();
        
        return bookingRepository.save(booking);
    }
    
    public Booking approveBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(BookingStatus.APPROVED);
        return bookingRepository.save(booking);
    }
    
    public Booking rejectBooking(Long bookingId, String rejectionReason) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(rejectionReason);
        return bookingRepository.save(booking);
    }
    
    public Booking cancelBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }
    
    private boolean hasConflict(Long resourceId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Booking> conflicts = bookingRepository.findByResourceIdAndStartTimeBeforeAndEndTimeAfter(
            resourceId, endTime, startTime);
        
        return !conflicts.isEmpty() && conflicts.stream()
            .anyMatch(b -> b.getStatus() != BookingStatus.REJECTED && 
                          b.getStatus() != BookingStatus.CANCELLED);
    }
}
