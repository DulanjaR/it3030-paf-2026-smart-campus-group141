package com.smartcampus.api.repository;

import com.smartcampus.api.entity.Ticket;
import com.smartcampus.api.entity.TicketStatus;
import com.smartcampus.api.entity.TicketPriority;
import com.smartcampus.api.entity.TicketCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Page<Ticket> findByCreatorId(Long creatorId, Pageable pageable);
    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);
    Page<Ticket> findByPriority(TicketPriority priority, Pageable pageable);
    Page<Ticket> findByCategory(TicketCategory category, Pageable pageable);
    Page<Ticket> findByAssignedTo(String assignedTo, Pageable pageable);
    Page<Ticket> findByCreatorIdAndStatus(Long creatorId, TicketStatus status, Pageable pageable);
}
