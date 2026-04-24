package com.smartcampus.api.controller;

import com.smartcampus.api.dto.*;
import com.smartcampus.api.entity.*;
import com.smartcampus.api.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {
    
    private final TicketService ticketService;
    
    // ===== TICKET ENDPOINTS =====
    
    /**
     * Create a new support ticket
     * POST /api/tickets
     */
    @PostMapping
    public ResponseEntity<?> createTicket(
            @RequestParam Long userId,
            @Valid @RequestBody CreateTicketRequest request) {
        try {
            Ticket ticket = ticketService.createTicket(
                userId,
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getPriority()
            );
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertToResponse(ticket));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get all tickets (paginated)
     * GET /api/tickets?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<?> getAllTickets(Pageable pageable) {
        try {
            Page<Ticket> tickets = ticketService.getAllTickets(pageable);
            Page<TicketResponse> response = tickets.map(this::convertToResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get ticket by ID
     * GET /api/tickets/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(convertToResponse(ticket));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get tickets by status
     * GET /api/tickets/filter/status?status=OPEN&page=0&size=10
     */
    @GetMapping("/filter/status")
    public ResponseEntity<?> getTicketsByStatus(
            @RequestParam TicketStatus status,
            Pageable pageable) {
        try {
            Page<Ticket> tickets = ticketService.getTicketsByStatus(status, pageable);
            Page<TicketResponse> response = tickets.map(this::convertToResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get tickets by priority
     * GET /api/tickets/filter/priority?priority=HIGH&page=0&size=10
     */
    @GetMapping("/filter/priority")
    public ResponseEntity<?> getTicketsByPriority(
            @RequestParam TicketPriority priority,
            Pageable pageable) {
        try {
            Page<Ticket> tickets = ticketService.getTicketsByPriority(priority, pageable);
            Page<TicketResponse> response = tickets.map(this::convertToResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get tickets by category
     * GET /api/tickets/filter/category?category=TECHNICAL&page=0&size=10
     */
    @GetMapping("/filter/category")
    public ResponseEntity<?> getTicketsByCategory(
            @RequestParam TicketCategory category,
            Pageable pageable) {
        try {
            Page<Ticket> tickets = ticketService.getTicketsByCategory(category, pageable);
            Page<TicketResponse> response = tickets.map(this::convertToResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get my tickets (by creator)
     * GET /api/tickets/my-tickets?userId=1&page=0&size=10
     */
    @GetMapping("/my-tickets")
    public ResponseEntity<?> getMyTickets(
            @RequestParam Long userId,
            Pageable pageable) {
        try {
            Page<Ticket> tickets = ticketService.getTicketsByCreator(userId, pageable);
            Page<TicketResponse> response = tickets.map(this::convertToResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get tickets assigned to a technician
     * GET /api/tickets/assigned-to?email=tech@campus.edu&page=0&size=10
     */
    @GetMapping("/assigned-to")
    public ResponseEntity<?> getAssignedTickets(
            @RequestParam String email,
            Pageable pageable) {
        try {
            Page<Ticket> tickets = ticketService.getTicketsByAssignee(email, pageable);
            Page<TicketResponse> response = tickets.map(this::convertToResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // ===== TICKET UPDATE ENDPOINTS (TECHNICIAN OPERATIONS) =====
    
    /**
     * Update ticket status (technician operation)
     * PATCH /api/tickets/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {
        try {
            Ticket ticket = ticketService.updateTicketStatus(id, request.getStatus());
            return ResponseEntity.ok(convertToResponse(ticket));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Update ticket priority
     * PATCH /api/tickets/{id}/priority
     */
    @PatchMapping("/{id}/priority")
    public ResponseEntity<?> updateTicketPriority(
            @PathVariable Long id,
            @RequestParam TicketPriority priority) {
        try {
            Ticket ticket = ticketService.updateTicketPriority(id, priority);
            return ResponseEntity.ok(convertToResponse(ticket));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Assign ticket to technician
     * POST /api/tickets/{id}/assign
     */
    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketRequest request) {
        try {
            Ticket ticket = ticketService.assignTicketToTechnician(id, request.getTechnicianEmail());
            return ResponseEntity.ok(convertToResponse(ticket));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Unassign ticket from technician
     * DELETE /api/tickets/{id}/assign
     */
    @DeleteMapping("/{id}/assign")
    public ResponseEntity<?> unassignTicket(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.unassignTicket(id);
            return ResponseEntity.ok(convertToResponse(ticket));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Delete ticket
     * DELETE /api/tickets/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        try {
            ticketService.deleteTicket(id);
            return ResponseEntity.ok(Map.of("message", "Ticket deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // ===== COMMENT ENDPOINTS =====
    
    /**
     * Add comment to ticket
     * POST /api/tickets/{id}/comments
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long id,
            @RequestParam Long userId,
            @Valid @RequestBody CreateCommentRequest request) {
        try {
            Comment comment = ticketService.addComment(id, userId, request.getContent());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertCommentToResponse(comment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get comments for a ticket (paginated)
     * GET /api/tickets/{id}/comments?page=0&size=10
     */
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getTicketComments(
            @PathVariable Long id,
            Pageable pageable) {
        try {
            Page<Comment> comments = ticketService.getTicketComments(id, pageable);
            Page<CommentResponse> response = comments.map(this::convertCommentToResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Update comment
     * PATCH /api/tickets/{ticketId}/comments/{commentId}
     */
    @PatchMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request) {
        try {
            Comment comment = ticketService.updateComment(commentId, request.getContent());
            return ResponseEntity.ok(convertCommentToResponse(comment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Delete comment
     * DELETE /api/tickets/{ticketId}/comments/{commentId}
     */
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId) {
        try {
            ticketService.deleteComment(commentId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // ===== ATTACHMENT ENDPOINTS =====
    
    /**
     * Upload attachment to ticket
     * POST /api/tickets/{id}/attachments
     * Max 3 attachments per ticket
     */
    @PostMapping("/{id}/attachments")
    public ResponseEntity<?> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            // In production, store file in cloud storage (S3, Azure Blob, etc.)
            // For now, we'll create a placeholder
            String fileName = file.getOriginalFilename();
            String fileUrl = "/uploads/tickets/" + id + "/" + fileName;
            long fileSize = file.getSize();
            String fileType = file.getContentType();
            
            // Validate file type (images only: jpg, png, gif)
            if (!isValidImageType(fileType)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Only image files (jpg, png, gif) are allowed"));
            }
            
            Attachment attachment = ticketService.addAttachment(
                id, fileName, fileUrl, fileSize, fileType
            );
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertAttachmentToResponse(attachment));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }
    
    /**
     * Get attachments for a ticket
     * GET /api/tickets/{id}/attachments?page=0&size=10
     */
    @GetMapping("/{id}/attachments")
    public ResponseEntity<?> getTicketAttachments(
            @PathVariable Long id,
            Pageable pageable) {
        try {
            Page<Attachment> attachments = ticketService.getTicketAttachments(id, pageable);
            Page<AttachmentResponse> response = attachments.map(this::convertAttachmentToResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Delete attachment
     * DELETE /api/tickets/{ticketId}/attachments/{attachmentId}
     */
    @DeleteMapping("/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(
            @PathVariable Long ticketId,
            @PathVariable Long attachmentId) {
        try {
            ticketService.deleteAttachment(attachmentId);
            return ResponseEntity.ok(Map.of("message", "Attachment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // ===== HELPER METHODS =====
    
    private TicketResponse convertToResponse(Ticket ticket) {
        return TicketResponse.builder()
            .id(ticket.getId())
            .title(ticket.getTitle())
            .description(ticket.getDescription())
            .creatorId(ticket.getCreator().getId())
            .creatorName(ticket.getCreator().getFirstName() + " " + ticket.getCreator().getLastName())
            .creatorEmail(ticket.getCreator().getEmail())
            .status(ticket.getStatus())
            .priority(ticket.getPriority())
            .category(ticket.getCategory())
            .assignedTo(ticket.getAssignedTo())
            .createdAt(ticket.getCreatedAt())
            .updatedAt(ticket.getUpdatedAt())
            .resolvedAt(ticket.getResolvedAt())
            .commentCount(ticket.getComments() != null ? ticket.getComments().size() : 0)
            .attachmentCount(ticket.getAttachments() != null ? ticket.getAttachments().size() : 0)
            .build();
    }
    
    private CommentResponse convertCommentToResponse(Comment comment) {
        return CommentResponse.builder()
            .id(comment.getId())
            .ticketId(comment.getTicket().getId())
            .content(comment.getContent())
            .authorId(comment.getAuthor().getId())
            .authorName(comment.getAuthor().getFirstName() + " " + comment.getAuthor().getLastName())
            .authorEmail(comment.getAuthor().getEmail())
            .createdAt(comment.getCreatedAt())
            .updatedAt(comment.getUpdatedAt())
            .build();
    }
    
    private AttachmentResponse convertAttachmentToResponse(Attachment attachment) {
        return AttachmentResponse.builder()
            .id(attachment.getId())
            .ticketId(attachment.getTicket().getId())
            .fileName(attachment.getFileName())
            .fileUrl(attachment.getFileUrl())
            .fileSize(attachment.getFileSize())
            .fileType(attachment.getFileType())
            .uploadedAt(attachment.getUploadedAt())
            .build();
    }
    
    private boolean isValidImageType(String fileType) {
        return fileType != null && (
            fileType.equals("image/jpeg") ||
            fileType.equals("image/png") ||
            fileType.equals("image/gif") ||
            fileType.equals("image/jpg")
        );
    }
}
