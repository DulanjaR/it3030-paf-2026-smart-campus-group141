package com.smartcampus.api.repository;

import com.smartcampus.api.entity.Booking;
import com.smartcampus.api.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        select b from Booking b
        join fetch b.resource r
        join fetch b.user u
        where (:userId is null or u.id = :userId)
          and (:resourceId is null or r.id = :resourceId)
          and (:bookingDate is null or b.bookingDate = :bookingDate)
          and (:status is null or b.status = :status)
        order by b.bookingDate desc, b.startTime desc
        """)
    List<Booking> searchBookings(
            @Param("userId") Long userId,
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("status") BookingStatus status
    );

    @Query("""
        select b from Booking b
        join fetch b.resource
        join fetch b.user
        where b.id = :id
        """)
    Optional<Booking> findDetailedById(@Param("id") Long id);

    List<Booking> findByResourceIdAndBookingDateAndStatusInAndStartTimeBeforeAndEndTimeAfter(
            Long resourceId,
            LocalDate bookingDate,
            List<BookingStatus> statuses,
            LocalDateTime newEnd,
            LocalDateTime newStart
    );
}
