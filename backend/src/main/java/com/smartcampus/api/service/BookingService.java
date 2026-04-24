package com.smartcampus.api.service;

import com.smartcampus.api.dto.BookingRequestDto;
import com.smartcampus.api.entity.Booking;
import com.smartcampus.api.entity.BookingStatus;
import com.smartcampus.api.entity.Resource;
import com.smartcampus.api.entity.User;
import com.smartcampus.api.exception.ApiException;
import com.smartcampus.api.repository.BookingRepository;
import com.smartcampus.api.repository.ResourceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
public class BookingService {

    private static final List<BookingStatus> CONFLICT_STATUSES = List.of(
            BookingStatus.PENDING,
            BookingStatus.APPROVED
    );

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final CurrentUserService currentUserService;

    public BookingService(
            BookingRepository bookingRepository,
            ResourceRepository resourceRepository,
            CurrentUserService currentUserService
    ) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.currentUserService = currentUserService;
    }

    public Booking createBooking(BookingRequestDto request, User user) {
        validateBookingTime(request);

        Resource resource = resourceRepository.findById(request.resourceId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Resource not found."));

        if (!Boolean.TRUE.equals(resource.getAvailable())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This resource is not available for booking.");
        }

        LocalDateTime startDateTime = LocalDateTime.of(request.date(), request.startTime());
        LocalDateTime endDateTime = LocalDateTime.of(request.date(), request.endTime());

        if (hasConflict(resource.getId(), request.date(), startDateTime, endDateTime)) {
            throw new ApiException(HttpStatus.CONFLICT, "This resource is already booked for the selected time.");
        }

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .bookingDate(request.date())
                .startTime(startDateTime)
                .endTime(endDateTime)
                .purpose(request.purpose())
                .status(BookingStatus.PENDING)
                .totalPrice(calculateTotalPrice(resource, startDateTime, endDateTime))
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings(LocalDate date, Long resourceId, BookingStatus status, User currentUser) {
        Long userId = currentUserService.isAdmin(currentUser) ? null : currentUser.getId();
        return bookingRepository.searchBookings(userId, resourceId, date, status);
    }

    @Transactional(readOnly = true)
    public Booking getBookingById(Long id, User currentUser) {
        Booking booking = getBookingById(id);
        validateCanView(booking, currentUser);
        return booking;
    }

    @Transactional(readOnly = true)
    public Booking getBookingById(Long id) {
        return bookingRepository.findDetailedById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found."));
    }

    public Booking approveBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        validatePending(booking, "Only PENDING bookings can be approved.");

        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionReason(null);
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long bookingId, String rejectionReason) {
        Booking booking = getBookingById(bookingId);
        validatePending(booking, "Only PENDING bookings can be rejected.");

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(rejectionReason);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long bookingId, User currentUser) {
        Booking booking = getBookingById(bookingId);
        validateCanCancel(booking, currentUser);

        if (booking.getStatus() == BookingStatus.REJECTED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only active bookings can be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    private void validateBookingTime(BookingRequestDto request) {
        if (request.date().isBefore(LocalDate.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Booking date cannot be in the past.");
        }

        if (!request.startTime().isBefore(request.endTime())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Start time must be before end time.");
        }
    }

    private boolean hasConflict(Long resourceId, LocalDate date, LocalDateTime newStart, LocalDateTime newEnd) {
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndBookingDateAndStatusInAndStartTimeBeforeAndEndTimeAfter(
                        resourceId,
                        date,
                        CONFLICT_STATUSES,
                        newEnd,
                        newStart
                );

        return conflicts.stream().anyMatch(existing ->
                newStart.isBefore(existing.getEndTime()) && newEnd.isAfter(existing.getStartTime())
        );
    }

    private Double calculateTotalPrice(Resource resource, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        long minutes = ChronoUnit.MINUTES.between(startDateTime, endDateTime);
        double hours = minutes / 60.0;
        return hours * resource.getPricePerHour();
    }

    private void validatePending(Booking booking, String message) {
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ApiException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private void validateCanView(Booking booking, User currentUser) {
        if (!currentUserService.isAdmin(currentUser) && !booking.getUser().getId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only view your own bookings.");
        }
    }

    private void validateCanCancel(Booking booking, User currentUser) {
        boolean owner = booking.getUser().getId().equals(currentUser.getId());
        if (!owner && !currentUserService.isAdmin(currentUser)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only cancel your own bookings.");
        }
    }
}
