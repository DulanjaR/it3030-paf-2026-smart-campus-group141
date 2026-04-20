# Team Contribution Tracking

This document tracks the individual contributions of each team member.

## Team Members

| Member | Name | Email | Role |
|--------|------|-------|------|
| 1 | [Name] | [Email] | Facilities & Resources |
| 2 | [Name] | [Email] | Bookings Management |
| 3 | [Name] | [Email] | Tickets & Maintenance |
| 4 | [Name] | [Email] | Notifications & Auth |

## Member 1: Facilities & Assets Catalogue

### Responsibilities
- Resource CRUD operations
- Resource search and filtering
- Resource availability management
- Associated API endpoints and UI components

### Endpoints Implemented
1. `GET /api/resources` - List all resources (GET)
2. `GET /api/resources/{id}` - Get resource details (GET)
3. `POST /api/resources` - Create resource (POST)
4. `PUT /api/resources/{id}` - Update resource (PUT)
5. `DELETE /api/resources/{id}` - Delete resource (DELETE)

### UI Components Implemented
- Resource List Page
- Resource Detail Page
- Resource Management Forms

### Commits
- [Link to relevant commits]

---

## Member 2: Booking Workflow Management

### Responsibilities
- Booking request creation
- Booking workflow (PENDING → APPROVED/REJECTED → CANCELLED)
- Conflict detection and prevention
- Admin approval/rejection functionality

### Endpoints Implemented
1. `GET /api/bookings` - List bookings (GET)
2. `POST /api/bookings` - Create booking request (POST)
3. `PATCH /api/bookings/{id}/approve` - Approve booking (PATCH)
4. `PATCH /api/bookings/{id}/reject` - Reject booking (PATCH)
5. `PATCH /api/bookings/{id}/cancel` - Cancel booking (PATCH)

### UI Components Implemented
- Booking List Page
- Booking Request Form
- Booking Approval Interface (Admin)
- Conflict Detection Display

### Commits
- [Link to relevant commits]

---

## Member 3: Maintenance & Incident Ticketing

### Responsibilities
- Incident ticket creation and management
- Image attachment handling (up to 3 files)
- Ticket workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- Technician assignment and status updates
- Comment system with ownership rules

### Endpoints Implemented
1. `GET /api/tickets` - List tickets (GET)
2. `POST /api/tickets` - Create ticket (POST)
3. `PUT /api/tickets/{id}` - Update ticket (PUT)
4. `PATCH /api/tickets/{id}/status` - Update status (PATCH)
5. `POST /api/tickets/{id}/comments` - Add comment (POST)

### UI Components Implemented
- Ticket List Page
- Ticket Creation Form with Image Upload
- Ticket Detail & Comments View
- Technician Assignment Interface

### Commits
- [Link to relevant commits]

---

## Member 4: Notifications & Role Management

### Responsibilities
- OAuth 2.0 Google Sign-In integration
- User authentication and session management
- Role-based access control (USER, ADMIN, TECHNICIAN)
- Notification system for booking/ticket updates
- Notification preferences management

### Endpoints Implemented
1. `POST /api/auth/login` - OAuth login (POST)
2. `GET /api/auth/me` - Get current user (GET)
3. `POST /api/auth/logout` - Logout (POST)
4. `GET /api/notifications` - List notifications (GET)
5. `PATCH /api/notifications/{id}` - Mark as read (PATCH)

### UI Components Implemented
- Login Page (OAuth Integration)
- Navigation & User Menu
- Notifications Panel
- Role-based Route Protection

### Commits
- [Link to relevant commits]

---

## Database Schema

[Add database diagram/schema documentation]

### Key Tables
- users
- resources
- bookings
- tickets
- comments
- notifications
- ticket_attachments

---

## Testing Evidence

### Backend Testing
- [Link to test reports/screenshots]

### Frontend Testing
- [Link to test reports/screenshots]

### API Testing (Postman)
- [Link to Postman collection]

---

## Important Notes

1. **Individual Assessment**: Each member will be assessed on their specific components
2. **Code Quality**: Follow REST principles, Java/React best practices, and proper error handling
3. **Commit History**: Maintain clear, meaningful commits with proper messages
4. **Documentation**: Document your code and API endpoints clearly
5. **Security**: Implement proper authentication, authorization, and input validation
6. **Testing**: Provide unit tests and integration test evidence

---

**Document Last Updated**: April 2026
