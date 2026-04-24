# Member 4 - Notifications, Role Management & OAuth Integration

## Overview
Member 4 implements the critical foundation for the entire Smart Campus application. Without these components, other members' functionalities (booking, tickets, resources) cannot operate.

## Responsibilities

### 1. Authentication & Authorization (Module E)
- **OAuth 2.0 Google Sign-In** - Secure login without passwords
- **User Management** - Create/update user profiles automatically
- **Role Assignment** - Assign roles to users (USER, TECHNICIAN, ADMIN)

### 2. Notifications (Module D)
- **Booking Events** - Notifications when bookings are approved/rejected
- **Ticket Updates** - Alert users when tickets are assigned or status changes
- **Comment Notifications** - Notify when new comments are added to tickets
- **WebUI Display** - Notification panel and badge in frontend

### 3. Role Management
- **USER** - Regular users who can create bookings and tickets
- **TECHNICIAN** - Can be assigned to tickets for maintenance
- **ADMIN** - Full administrative access

## Backend Implementation

### Controllers & Endpoints

#### AuthController (`/api/auth`)
```java
POST   /api/auth/login                    // Google OAuth login
GET    /api/auth/profile/{userId}         // Get user profile
PUT    /api/auth/profile/{userId}         // Update profile
POST   /api/auth/logout                   // Logout
GET    /api/auth/verify/{userId}          // Verify authentication
```

#### NotificationController (`/api/notifications`)
```java
GET    /api/notifications/{userId}        // Get all notifications (limit=50)
GET    /api/notifications/{userId}/unread // Get unread only
GET    /api/notifications/{userId}/count  // Get unread count
PUT    /api/notifications/{notificationId}/read        // Mark single as read
PUT    /api/notifications/{userId}/read-all           // Mark all as read
DELETE /api/notifications/{notificationId}            // Delete single
DELETE /api/notifications/{userId}/all                // Delete all
```

#### RoleManagementController (`/api/roles`)
```java
POST   /api/roles/change                  // Change user role (Admin)
GET    /api/roles/users                   // Get all users (Admin)
GET    /api/roles/users/by-role/{role}   // Get users by role (Admin)
PUT    /api/roles/users/{userId}/status   // Toggle user status (Admin)
```

### Services

#### AuthService
- Verifies Google OAuth tokens
- Creates/updates User entities
- Generates JWT tokens
- Provides user lookup methods used by other services

#### NotificationService
- **Critical for other modules**: Called by Booking, Ticket, and Comment services
- Creates notifications for events
- Manages notification read status
- Provides user notification queries

#### RoleManagementService
- Updates user roles with audit trail
- Enforces admin-only operations
- Provides role checking utilities for other services

### Database Entities

#### User Entity
```java
- id (Long)
- email (String, unique)
- firstName, lastName (String)
- googleId (String, unique)
- profilePictureUrl (String)
- role (UserRole enum: USER, TECHNICIAN, ADMIN)
- active (Boolean)
- createdAt, updatedAt (LocalDateTime)
- notifications (One-to-Many relationship)
- bookings (One-to-Many relationship)
- tickets (One-to-Many relationship)
```

#### Notification Entity
```java
- id (Long)
- user (ManyToOne -> User)
- title, message (String)
- type (NotificationType enum)
- read (Boolean)
- relatedResourceId (String) - Links to booking/ticket
- createdAt, readAt (LocalDateTime)
```

## Frontend Implementation

### Components

#### LoginPage (`/src/pages/LoginPage.jsx`)
- Google OAuth Sign-In button (or mock for development)
- Calls POST `/api/auth/login`
- Stores user and token in Zustand auth store
- Redirects to dashboard on success

#### NotificationPanel (`/src/components/NotificationPanel.jsx`)
- Displays list of user notifications
- Shows notification type with icon
- Mark as read / Delete functionality
- Auto-refreshes on open
- Integrated into Layout

#### NotificationBell (`/src/components/NotificationBell.jsx`)
- Badge showing unread count
- Click to open notification panel
- Positioned in navbar

#### RoleManagementPage (`/src/pages/RoleManagementPage.jsx`)
- Admin-only page for user management
- Change user roles
- Activate/deactivate users
- List all users with their roles

### Services & Utilities

#### member4API.js
Collection of API call functions:
- `authAPI.loginWithGoogle(token)`
- `authAPI.getUserProfile(userId)`
- `authAPI.updateProfile(userId, firstName, lastName)`
- `notificationAPI.getUnreadNotifications(userId)`
- `notificationAPI.markAsRead(notificationId)`
- `roleAPI.changeUserRole(userId, newRole, adminId)`

## Integration with Other Modules

### Member 1: Facilities & Assets Catalogue
**Dependency**: User entity from Member 4
- Resource creation requires authenticated user
- Resources associated with User who created them
- Admin-only resource management (uses Member 4 roles)

**Integration Points**:
```java
// In ResourceController
@PreAuthorize("hasRole('ADMIN')") // Uses Member 4 roles
public ResponseEntity<Resource> createResource(...) { }

// Must inject RoleManagementService to check roles
```

### Member 2: Booking Management
**Dependencies**: User, Notification
- Bookings belong to User created by Member 4 OAuth
- Must notify user when booking is approved/rejected
- Admin approval requires ADMIN role

**Integration Points**:
```java
// In BookingService
public Booking createBooking(Long userId, CreateBookingRequest request) {
    // Validate user exists (from Member 4)
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException());
}

// When admin approves booking
public Booking approveBooking(Long bookingId, Long adminId) {
    // Check admin has ADMIN role (Member 4)
    boolean isAdmin = roleManagementService.userHasRole(adminId, UserRole.ADMIN);
    
    // Notify user
    notificationService.createNotification(
        booking.getUser(),
        "Booking Approved",
        "Your booking for " + resource.getName() + " has been approved",
        NotificationType.BOOKING_APPROVED,
        "booking_" + booking.getId()
    );
}
```

### Member 3: Incident Ticketing & Comments
**Dependencies**: User, Notification, Technician role
- Tickets created by User (Member 4)
- Can be assigned to TECHNICIAN role users
- Notifications for ticket updates and comments
- Comment ownership enforced by User

**Integration Points**:
```java
// In TicketService
public Ticket createTicket(Long userId, CreateTicketRequest request) {
    User creator = authService.getUserById(userId); // Member 4 service
    Ticket ticket = new Ticket();
    ticket.setCreator(creator);
    // ...
}

// Assign technician
public Ticket assignTicket(Long ticketId, Long technicianId) {
    // Verify technician has TECHNICIAN role
    User technician = authService.getUserById(technicianId);
    if (!technician.getRole().equals(UserRole.TECHNICIAN)) {
        throw new NotATechnicianException();
    }
    
    // Notify technician
    notificationService.createNotification(
        technician,
        "Ticket Assigned",
        "A new ticket has been assigned to you",
        NotificationType.TICKET_ASSIGNED,
        "ticket_" + ticketId
    );
}

// When comment is added
public Comment addComment(Long ticketId, Long userId, String text) {
    User author = authService.getUserById(userId); // Member 4
    Comment comment = new Comment();
    comment.setCreator(author);
    // ...
    
    // Notify ticket creator and assignee
    notificationService.createNotification(
        ticket.getCreator(),
        "New Comment on Your Ticket",
        author.getFirstName() + " commented on your ticket",
        NotificationType.COMMENT_NOTIFICATION
    );
}
```

## Setup & Configuration

### Backend Setup
1. **Dependencies**: Google Auth library added to pom.xml
2. **Database**: Entities with JPA relationships configured
3. **Security**: OAuth 2.0 endpoints configured in SecurityConfig
4. **Repositories**: Custom query methods for notifications and roles

### Frontend Setup
1. **Google OAuth**: Set `VITE_GOOGLE_CLIENT_ID` in `.env`
2. **API Base**: Configure API endpoints in `member4API.js`
3. **Auth Store**: Zustand store manages user and token
4. **Route Protection**: Use auth store to protect routes

### Environment Variables
```
# Backend (.env.local)
GOOGLE_CLIENT_ID=your-google-client-id
SPRING_DATASOURCE_URL=...
SPRING_DATASOURCE_PASSWORD=...

# Frontend (.env)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE=http://localhost:8081/api
```

## Testing Checklist

- [ ] OAuth login flow works (or mock login in dev)
- [ ] User profiles created automatically on first login
- [ ] Role assignment changes permissions
- [ ] Notifications created by other modules appear in notification panel
- [ ] Unread badge updates correctly
- [ ] Mark as read / Mark all as read works
- [ ] Admin can change user roles
- [ ] Admin can activate/deactivate users
- [ ] Other members' endpoints work with authenticated users

## HTTP Methods Implemented

### Member 4 Endpoints
- **GET**: `/auth/profile/{userId}`, `/auth/verify/{userId}`, `/notifications/{userId}`, `/notifications/{userId}/unread`, `/notifications/{userId}/count`, `/roles/users`, `/roles/users/by-role/{role}`
- **POST**: `/auth/login`, `/auth/logout`, `/roles/change`
- **PUT**: `/auth/profile/{userId}`, `/notifications/{notificationId}/read`, `/notifications/{userId}/read-all`, `/roles/users/{userId}/status`
- **DELETE**: `/notifications/{notificationId}`, `/notifications/{userId}/all`

All Member 4 endpoints use different HTTP methods as required by the assignment.

## Frontend Pages & Components Created

1. **LoginPage** - OAuth 2.0 login entry point
2. **NotificationPanel** - Sidebar showing notifications
3. **NotificationBell** - Navbar badge with unread count
4. **RoleManagementPage** - Admin user management interface
5. **member4API.js** - Service layer for API calls

## Next Steps for Other Members

To integrate with Member 4, other members should:

1. **Inject these services** in their service classes:
   - `AuthService` - For user lookups
   - `NotificationService` - For sending notifications
   - `RoleManagementService` - For permission checks

2. **Call these methods** when needed:
   ```java
   // Check user role
   roleManagementService.userHasRole(userId, UserRole.ADMIN)
   
   // Create notification
   notificationService.createNotification(user, title, message, type)
   
   // Get user info
   authService.getUserById(userId)
   ```

3. **Frontend integration**:
   - Import `member4API` functions
   - Use `useAuthStore` for current user
   - Add NotificationBell to Layout
   - Trigger notification refresh on events

---
**Member 4 Implementation** - Critical foundation for Smart Campus application
