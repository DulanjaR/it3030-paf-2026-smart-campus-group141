# Smart Campus - Architecture & Design Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite)                                │   │
│  │  - Material Design UI with Tailwind CSS               │   │
│  │  - OAuth 2.0 Google Login                             │   │
│  │  - State Management (Zustand)                         │   │
│  │  - Responsive Layout                                  │   │
│  └──────────────────┬──────────────────────────────────┘   │
└─────────────────────┼────────────────────────────────────────┘
                      │ HTTP/HTTPS (Axios)
                      │ REST API Calls
                      │
┌─────────────────────▼────────────────────────────────────────┐
│                    Network / Internet                         │
└─────────────────────┬────────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────────┐
│               Spring Boot API Server                          │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  REST API Endpoints (Port 8080)                      │    │
│  │  - Resource Management                               │    │
│  │  - Booking Workflow                                  │    │
│  │  - Incident Ticketing                                │    │
│  │  - Notifications                                     │    │
│  │  - Authentication & Authorization                    │    │
│  └──────┬──────────────────────────────────┬────────────┘    │
│         │                                  │                  │
│  ┌──────▼────────────────────┐    ┌────────▼──────────────┐  │
│  │  Security & Auth          │    │  Business Logic       │  │
│  │  - OAuth 2.0              │    │  - JPA Repositories   │  │
│  │  - JWT Token Validation   │    │  - Service Layer      │  │
│  │  - Role-Based Access      │    │  - DTO Mapping        │  │
│  │  - CORS Configuration     │    │  - Validation Rules   │  │
│  └──────┬─────────────────────┘    └────────┬──────────────┘  │
│         │                                  │                  │
│         └──────────────────┬───────────────┘                  │
│                            │                                  │
│  ┌─────────────────────────▼──────────────────────────┐      │
│  │         JPA Persistence Layer                      │      │
│  │  - Entity Mapping                                  │      │
│  │  - Database Queries                                │      │
│  │  - Transaction Management                          │      │
│  └─────────────────────────┬──────────────────────────┘      │
└──────────────────────────────┼───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│                    Database Layer                            │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  H2 Database (Development)                           │    │
│  │  PostgreSQL (Production)                             │    │
│  │                                                      │    │
│  │  Tables:                                             │    │
│  │  - users                                             │    │
│  │  - resources                                         │    │
│  │  - bookings                                          │    │
│  │  - tickets                                           │    │
│  │  - comments                                          │    │
│  │  - notifications                                     │    │
│  │  - attachments                                       │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Layered Architecture Pattern

```
┌─────────────────────────────────────┐
│      REST Controller Layer           │
│  (HTTP Requests/Responses)           │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      Service Layer                   │
│  (Business Logic)                    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      Repository Layer                │
│  (Data Access - JPA)                 │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      Entity/Model Layer              │
│  (Database Entities)                 │
└─────────────────────────────────────┘
```

### Package Structure

```
com.smartcampus.api
├── config/
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   └── CorsConfig.java
├── controller/
│   ├── AuthController.java
│   ├── ResourceController.java
│   ├── BookingController.java
│   ├── TicketController.java
│   └── NotificationController.java
├── service/
│   ├── AuthService.java
│   ├── ResourceService.java
│   ├── BookingService.java
│   ├── TicketService.java
│   ├── NotificationService.java
│   └── impl/
│       ├── AuthServiceImpl.java
│       ├── ResourceServiceImpl.java
│       ├── BookingServiceImpl.java
│       ├── TicketServiceImpl.java
│       └── NotificationServiceImpl.java
├── repository/
│   ├── UserRepository.java
│   ├── ResourceRepository.java
│   ├── BookingRepository.java
│   ├── TicketRepository.java
│   ├── CommentRepository.java
│   ├── NotificationRepository.java
│   └── AttachmentRepository.java
├── model/
│   ├── User.java
│   ├── Resource.java
│   ├── Booking.java
│   ├── Ticket.java
│   ├── Comment.java
│   ├── Notification.java
│   ├── Attachment.java
│   └── enums/
│       ├── UserRole.java
│       ├── BookingStatus.java
│       ├── TicketStatus.java
│       └── Priority.java
├── dto/
│   ├── AuthDTO.java
│   ├── UserDTO.java
│   ├── ResourceDTO.java
│   ├── BookingDTO.java
│   ├── TicketDTO.java
│   ├── CommentDTO.java
│   └── NotificationDTO.java
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── BookingConflictException.java
│   ├── UnauthorizedException.java
│   └── ValidationException.java
├── util/
│   ├── ValidationUtil.java
│   ├── DateUtil.java
│   └── FileUtil.java
└── SmartCampusApiApplication.java
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── layout/
│   │   └── Layout.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── resources/
│   │   ├── ResourceList.jsx
│   │   ├── ResourceCard.jsx
│   │   ├── ResourceForm.jsx
│   │   └── ResourceFilters.jsx
│   ├── bookings/
│   │   ├── BookingList.jsx
│   │   ├── BookingForm.jsx
│   │   ├── BookingApproval.jsx
│   │   └── BookingDetails.jsx
│   ├── tickets/
│   │   ├── TicketList.jsx
│   │   ├── TicketForm.jsx
│   │   ├── TicketDetails.jsx
│   │   ├── CommentSection.jsx
│   │   └── ImageUpload.jsx
│   └── notifications/
│       ├── NotificationPanel.jsx
│       ├── NotificationItem.jsx
│       └── NotificationSettings.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── ResourcesPage.jsx
│   ├── BookingsPage.jsx
│   ├── TicketsPage.jsx
│   └── NotificationsPage.jsx
├── services/
│   ├── apiClient.js
│   └── apiServices.js
├── store/
│   ├── authStore.js
│   ├── resourceStore.js
│   ├── bookingStore.js
│   ├── ticketStore.js
│   └── notificationStore.js
├── hooks/
│   ├── useAuth.js
│   ├── useResources.js
│   ├── useBookings.js
│   └── useTickets.js
├── utils/
│   ├── dateUtils.js
│   ├── validationUtils.js
│   └── errorHandler.js
├── App.jsx
└── main.jsx
```

## Data Flow

### Booking Creation Flow

```
1. User fills booking form
   ↓
2. Frontend validates input
   ↓
3. POST /api/bookings (with auth token)
   ↓
4. Backend controller receives request
   ↓
5. Service layer validates:
   - Check resource exists
   - Check conflicts with existing bookings
   - Validate date/time range
   ↓
6. If valid: Create booking (PENDING status)
   ↓
7. Save to database
   ↓
8. Create notification for admins
   ↓
9. Return booking details
   ↓
10. Frontend updates state and UI
```

### Ticket Creation with Attachment Flow

```
1. User creates ticket + uploads images
   ↓
2. Frontend:
   - Validates form
   - Compresses/validates images
   - Creates FormData with multipart upload
   ↓
3. POST /api/tickets (multipart/form-data)
   ↓
4. Backend:
   - Validates file size/type
   - Saves files to storage
   - Creates ticket record
   - Creates attachment records
   ↓
5. Notify resource manager
   ↓
6. Return ticket with attachment info
   ↓
7. Frontend displays ticket and images
```

## REST API Design Principles

1. **Resource-Oriented URLs**
   - `/api/resources` - Resource collection
   - `/api/resources/{id}` - Specific resource

2. **HTTP Methods**
   - GET - Retrieve data (safe, idempotent)
   - POST - Create new resource
   - PUT - Full update (idempotent)
   - PATCH - Partial update
   - DELETE - Remove resource (idempotent)

3. **Status Codes**
   - 200 OK - Successful request
   - 201 Created - Resource created
   - 204 No Content - Successful deletion
   - 400 Bad Request - Validation error
   - 401 Unauthorized - Authentication required
   - 403 Forbidden - Insufficient permissions
   - 404 Not Found - Resource doesn't exist
   - 409 Conflict - Business logic violation
   - 500 Internal Server Error

4. **Error Response Format**
   ```json
   {
     "timestamp": "2026-04-20T10:00:00Z",
     "status": 400,
     "error": "Bad Request",
     "message": "Validation failed",
     "details": {
       "field": "startTime",
       "message": "Must be in future"
     }
   }
   ```

## Security Architecture

1. **Authentication**
   - OAuth 2.0 Google Sign-In
   - JWT token issuance after login
   - Token stored in localStorage (frontend)
   - Token validation on each request

2. **Authorization**
   - Role-based access control (RBAC)
   - Method-level security annotations
   - Endpoint-level role checks

3. **Data Protection**
   - HTTPS in production
   - CORS configuration
   - CSRF protection (Spring Security)
   - Input validation and sanitization

## Database Design

### Entity Relationships

```
User (1) ─────────── (N) Booking
User (1) ─────────── (N) Ticket
User (1) ─────────── (N) Comment
User (1) ─────────── (N) Notification

Resource (1) ───────── (N) Booking
Resource (1) ───────── (N) Ticket

Ticket (1) ─────────── (N) Comment
Ticket (1) ─────────── (N) Attachment

Booking (1) ─────────── (N) Notification
Ticket (1) ─────────── (N) Notification
```

---

**Last Updated**: April 2026
