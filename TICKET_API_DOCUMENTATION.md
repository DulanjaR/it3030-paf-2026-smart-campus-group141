# Ticket Management API - Complete Implementation

## Overview
Complete REST API for managing support tickets with attachments and technician assignments.

---

## Ticket Endpoints

### 1. Create Ticket
```
POST /api/tickets
Content-Type: application/json

{
  "title": "Classroom A Projector Not Working",
  "description": "The projector in classroom A is not displaying any image...",
  "category": "TECHNICAL",
  "priority": "HIGH"
}
Query: ?userId=1
Response: 201 Created with TicketResponse
```

### 2. Get All Tickets (Paginated)
```
GET /api/tickets?page=0&size=10
Response: 200 OK with paginated TicketResponse[]
```

### 3. Get Ticket by ID
```
GET /api/tickets/{id}
Response: 200 OK with TicketResponse
```

### 4. Filter by Status
```
GET /api/tickets/filter/status?status=OPEN&page=0&size=10
Status Values: OPEN, IN_PROGRESS, RESOLVED, CLOSED, REOPENED
Response: 200 OK with paginated TicketResponse[]
```

### 5. Filter by Priority
```
GET /api/tickets/filter/priority?priority=HIGH&page=0&size=10
Priority Values: LOW, MEDIUM, HIGH, CRITICAL
Response: 200 OK with paginated TicketResponse[]
```

### 6. Filter by Category
```
GET /api/tickets/filter/category?category=TECHNICAL&page=0&size=10
Category Values: TECHNICAL, MAINTENANCE, BILLING, GENERAL_INQUIRY, COMPLAINT
Response: 200 OK with paginated TicketResponse[]
```

### 7. Get My Tickets
```
GET /api/tickets/my-tickets?userId=1&page=0&size=10
Response: 200 OK with paginated TicketResponse[]
```

### 8. Get Assigned Tickets (For Technicians)
```
GET /api/tickets/assigned-to?email=tech@campus.edu&page=0&size=10
Response: 200 OK with paginated TicketResponse[]
```

---

## Technician Operations

### 1. Assign Ticket to Technician
```
POST /api/tickets/{id}/assign
Content-Type: application/json

{
  "technicianEmail": "john.tech@campus.edu"
}
Response: 200 OK with TicketResponse (status changed to IN_PROGRESS)
```

### 2. Unassign Ticket from Technician
```
DELETE /api/tickets/{id}/assign
Response: 200 OK with success message
```

### 3. Update Ticket Status
```
PATCH /api/tickets/{id}/status
Content-Type: application/json

{
  "status": "RESOLVED"
}
Status Values: OPEN, IN_PROGRESS, RESOLVED, CLOSED, REOPENED
Response: 200 OK with TicketResponse
```

### 4. Update Ticket Priority
```
PATCH /api/tickets/{id}/priority?priority=CRITICAL
Response: 200 OK with TicketResponse
```

### 5. Delete Ticket
```
DELETE /api/tickets/{id}
Response: 200 OK with success message
```

---

## Comment Endpoints

### 1. Add Comment to Ticket
```
POST /api/tickets/{id}/comments
Content-Type: application/json
Query: ?userId=1

{
  "content": "I've checked the projector. It needs a bulb replacement."
}
Response: 201 Created with CommentResponse
```

### 2. Get Ticket Comments
```
GET /api/tickets/{id}/comments?page=0&size=10
Response: 200 OK with paginated CommentResponse[]
```

### 3. Update Comment
```
PATCH /api/tickets/{ticketId}/comments/{commentId}
Content-Type: application/json

{
  "content": "Updated comment content..."
}
Response: 200 OK with CommentResponse
```

### 4. Delete Comment
```
DELETE /api/tickets/{ticketId}/comments/{commentId}
Response: 200 OK with success message
```

---

## Attachment Endpoints

### 1. Upload Attachment
```
POST /api/tickets/{id}/attachments
Content-Type: multipart/form-data

Files: images only (jpg, png, gif)
Max: 3 attachments per ticket

Response: 201 Created with AttachmentResponse
```

### 2. Get Ticket Attachments
```
GET /api/tickets/{id}/attachments?page=0&size=10
Response: 200 OK with paginated AttachmentResponse[]
```

### 3. Delete Attachment
```
DELETE /api/tickets/{ticketId}/attachments/{attachmentId}
Response: 200 OK with success message
```

---

## Data Models

### TicketResponse
```json
{
  "id": 1,
  "title": "Classroom A Projector Not Working",
  "description": "The projector...",
  "creatorId": 1,
  "creatorName": "John Student",
  "creatorEmail": "john@campus.edu",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "category": "TECHNICAL",
  "assignedTo": "tech@campus.edu",
  "createdAt": "2026-04-23T10:30:00",
  "updatedAt": "2026-04-23T10:35:00",
  "resolvedAt": null,
  "commentCount": 2,
  "attachmentCount": 1
}
```

### CommentResponse
```json
{
  "id": 1,
  "ticketId": 1,
  "content": "I've checked the issue...",
  "authorId": 2,
  "authorName": "John Technician",
  "authorEmail": "tech@campus.edu",
  "createdAt": "2026-04-23T10:32:00",
  "updatedAt": "2026-04-23T10:32:00"
}
```

### AttachmentResponse
```json
{
  "id": 1,
  "ticketId": 1,
  "fileName": "projector_issue.jpg",
  "fileUrl": "/uploads/tickets/1/projector_issue.jpg",
  "fileSize": 245632,
  "fileType": "image/jpeg",
  "uploadedAt": "2026-04-23T10:33:00"
}
```

---

## Features Implemented

✅ **Ticket Management**
- Create tickets with category, priority, and description
- Filter by status, priority, category, creator, or assignee
- Update ticket status (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- Support for reopening resolved tickets (REOPENED status)

✅ **Technician Operations**
- Assign tickets to technicians by email
- Unassign tickets
- Update priority in real-time
- Status tracking from creation to resolution

✅ **Comments System**
- Add comments with automatic author tracking
- Edit and delete comments
- Paginated comment retrieval
- Comment timestamps

✅ **File Attachments**
- Upload images (jpg, png, gif only)
- Max 3 attachments per ticket
- Automatic file metadata storage (name, size, type)
- Delete individual attachments

✅ **Validation**
- Title and description length validation
- Email validation for technician assignment
- File type validation (images only)
- Attachment count limits

---

## Usage Examples

### Example 1: Create & Manage a Ticket
```bash
# 1. Create ticket
curl -X POST http://localhost:8081/api/tickets?userId=1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "WiFi Down in Building C",
    "description": "WiFi is not working in the entire building C",
    "category": "TECHNICAL",
    "priority": "CRITICAL"
  }'

# 2. Assign to technician
curl -X POST http://localhost:8081/api/tickets/1/assign \
  -H "Content-Type: application/json" \
  -d '{
    "technicianEmail": "john.tech@campus.edu"
  }'

# 3. Add status update
curl -X PATCH http://localhost:8081/api/tickets/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'

# 4. Add comment
curl -X POST http://localhost:8081/api/tickets/1/comments?userId=2 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Identified router issue. Performing restart..."
  }'

# 5. Upload attachment
curl -X POST http://localhost:8081/api/tickets/1/attachments \
  -F "file=@router_error.jpg"

# 6. Mark as resolved
curl -X PATCH http://localhost:8081/api/tickets/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "RESOLVED"
  }'
```

---

## Technical Details

### Service Layer (TicketService)
- Transactional operations for data consistency
- Lazy loading for related entities (User, Comment, Attachment)
- Cascade delete for comments and attachments
- Automatic timestamp management

### Repository Methods
- `findByCreatorId()` - Get user's own tickets
- `findByStatus()` - Filter by status
- `findByPriority()` - Filter by priority
- `findByCategory()` - Filter by category
- `findByAssignedTo()` - Get technician's assigned tickets
- `countByTicketId()` - Validate attachment limits

### Validation
- `@NotBlank`, `@Size` - Text validation
- `@Email` - Email format validation
- `@NotNull` - Required field validation
- Custom file type validation

---

## Next Steps (Optional Enhancements)

1. **File Storage**
   - Integrate Azure Blob Storage or AWS S3
   - Generate signed URLs for secure file access

2. **Notifications**
   - Notify user when ticket is assigned
   - Notify technician of new comments
   - Email notifications for status changes

3. **Analytics**
   - Average resolution time
   - Ticket metrics dashboard
   - Technician performance tracking

4. **Advanced Features**
   - Ticket templates for common issues
   - SLA (Service Level Agreement) tracking
   - Auto-assignment based on technician load
   - Ticket escalation rules
