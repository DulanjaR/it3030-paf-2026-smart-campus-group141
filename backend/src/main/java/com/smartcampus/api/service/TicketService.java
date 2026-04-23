package com.smartcampus.api.service;

import com.smartcampus.api.entity.*;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.CommentRepository;
import com.smartcampus.api.repository.AttachmentRepository;
import com.smartcampus.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketService {
    
    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    
    // ===== TICKET CRUD =====
    
    public Ticket createTicket(Long creatorId, String title, String description, 
                               TicketCategory category, TicketPriority priority) {
        User creator = userRepository.findById(creatorId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Ticket ticket = Ticket.builder()
            .title(title)
            .description(description)
            .creator(creator)
            .category(category)
            .priority(priority)
            .status(TicketStatus.OPEN)
            .build();
        
        return ticketRepository.save(ticket);
    }
    
    public Ticket getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
    
    public Page<Ticket> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable);
    }
    
    public Page<Ticket> getTicketsByStatus(TicketStatus status, Pageable pageable) {
        return ticketRepository.findByStatus(status, pageable);
    }
    
    public Page<Ticket> getTicketsByPriority(TicketPriority priority, Pageable pageable) {
        return ticketRepository.findByPriority(priority, pageable);
    }
    
    public Page<Ticket> getTicketsByCategory(TicketCategory category, Pageable pageable) {
        return ticketRepository.findByCategory(category, pageable);
    }
    
    public Page<Ticket> getTicketsByCreator(Long creatorId, Pageable pageable) {
        return ticketRepository.findByCreatorId(creatorId, pageable);
    }
    
    public Page<Ticket> getTicketsByAssignee(String assignedTo, Pageable pageable) {
        return ticketRepository.findByAssignedTo(assignedTo, pageable);
    }
    
    // ===== TICKET UPDATES =====
    
    public Ticket updateTicketStatus(Long ticketId, TicketStatus newStatus) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setStatus(newStatus);
        
        if (newStatus == TicketStatus.RESOLVED || newStatus == TicketStatus.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        
        return ticketRepository.save(ticket);
    }
    
    public Ticket updateTicketPriority(Long ticketId, TicketPriority newPriority) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setPriority(newPriority);
        return ticketRepository.save(ticket);
    }
    
    public Ticket assignTicketToTechnician(Long ticketId, String technicianEmail) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setAssignedTo(technicianEmail);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        return ticketRepository.save(ticket);
    }
    
    public Ticket unassignTicket(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setAssignedTo(null);
        return ticketRepository.save(ticket);
    }
    
    public void deleteTicket(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        ticketRepository.delete(ticket);
    }
    
    // ===== COMMENTS =====
    
    public Comment addComment(Long ticketId, Long authorId, String content) {
        Ticket ticket = getTicketById(ticketId);
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Comment comment = Comment.builder()
            .ticket(ticket)
            .author(author)
            .content(content)
            .build();
        
        return commentRepository.save(comment);
    }
    
    public Page<Comment> getTicketComments(Long ticketId, Pageable pageable) {
        return commentRepository.findByTicketId(ticketId, pageable);
    }
    
    public Comment updateComment(Long commentId, String newContent) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(newContent);
        return commentRepository.save(comment);
    }
    
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(comment);
    }
    
    // ===== ATTACHMENTS =====
    
    public Attachment addAttachment(Long ticketId, String fileName, String fileUrl, 
                                   Long fileSize, String fileType) {
        Ticket ticket = getTicketById(ticketId);
        
        // Check attachment limit (max 3 per ticket)
        long attachmentCount = attachmentRepository.countByTicketId(ticketId);
        if (attachmentCount >= 3) {
            throw new RuntimeException("Maximum 3 attachments allowed per ticket");
        }
        
        Attachment attachment = Attachment.builder()
            .ticket(ticket)
            .fileName(fileName)
            .fileUrl(fileUrl)
            .fileSize(fileSize)
            .fileType(fileType)
            .build();
        
        return attachmentRepository.save(attachment);
    }
    
    public Page<Attachment> getTicketAttachments(Long ticketId, Pageable pageable) {
        return attachmentRepository.findByTicketId(ticketId, pageable);
    }
    
    public Attachment getAttachmentById(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new RuntimeException("Attachment not found"));
    }
    
    public void deleteAttachment(Long attachmentId) {
        Attachment attachment = getAttachmentById(attachmentId);
        attachmentRepository.delete(attachment);
    }
}
