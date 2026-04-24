package com.smartcampus.api.controller;

import com.smartcampus.api.dto.BookingRequestDto;
import com.smartcampus.api.dto.BookingResponseDto;
import com.smartcampus.api.dto.RejectBookingRequestDto;
import com.smartcampus.api.entity.BookingStatus;
import com.smartcampus.api.entity.User;
import com.smartcampus.api.service.BookingService;
import com.smartcampus.api.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final CurrentUserService currentUserService;

    public BookingController(BookingService bookingService, CurrentUserService currentUserService) {
        this.bookingService = bookingService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
            @Valid @RequestBody BookingRequestDto request
    ) {
        User currentUser = currentUserService.getCurrentUser(authorization);
        BookingResponseDto response = BookingResponseDto.from(bookingService.createBooking(request, currentUser));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
            @RequestParam(required = false) Long resourceId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        User currentUser = currentUserService.getCurrentUser(authorization);
        List<BookingResponseDto> bookings = bookingService
                .getAllBookings(date, resourceId, status, currentUser)
                .stream()
                .map(BookingResponseDto::from)
                .toList();

        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDto> getBookingById(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
            @PathVariable Long id
    ) {
        User currentUser = currentUserService.getCurrentUser(authorization);
        return ResponseEntity.ok(BookingResponseDto.from(bookingService.getBookingById(id, currentUser)));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponseDto> approveBooking(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
            @PathVariable Long id
    ) {
        User currentUser = currentUserService.getCurrentUser(authorization);
        currentUserService.requireAdmin(currentUser);
        return ResponseEntity.ok(BookingResponseDto.from(bookingService.approveBooking(id)));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDto> rejectBooking(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
            @PathVariable Long id,
            @Valid @RequestBody RejectBookingRequestDto request
    ) {
        User currentUser = currentUserService.getCurrentUser(authorization);
        currentUserService.requireAdmin(currentUser);
        return ResponseEntity.ok(BookingResponseDto.from(bookingService.rejectBooking(id, request.rejectionReason())));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
            @PathVariable Long id
    ) {
        User currentUser = currentUserService.getCurrentUser(authorization);
        return ResponseEntity.ok(BookingResponseDto.from(bookingService.cancelBooking(id, currentUser)));
    }
}
