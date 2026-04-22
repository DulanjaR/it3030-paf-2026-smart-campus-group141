package com.smartcampus.api.repository;

import com.smartcampus.api.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByTicketId(Long ticketId, Pageable pageable);
    Page<Comment> findByAuthorId(Long authorId, Pageable pageable);
}
