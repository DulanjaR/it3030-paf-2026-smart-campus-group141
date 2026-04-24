# Member 4 - Notifications & Role Management API Documentation

## Overview
Member 4 has implemented the complete notifications system, role management features, and improved authentication with signup capabilities.

## Backend API Endpoints

### Authentication Endpoints

#### POST `/api/users/register`
Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "profilePictureUrl": null
  },
  "token": "jwt-token-1234567890"
}
```

#### POST `/api/users/login`
Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "profilePictureUrl": null
  },
  "token": "jwt-token-1234567890"
}
```

### User Profile Endpoints

#### GET `/api/users/{id}`
Get user profile by ID.

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "active": true,
  "profilePictureUrl": null,
  "createdAt": "2026-04-24T10:00:00Z",
  "updatedAt": "2026-04-24T10:00:00Z"
}
```

#### PUT `/api/users/{id}`
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "profilePictureUrl": "https://example.com/avatar.jpg"
}
```

**Response (200):** Updated user object

### Role Management Endpoints (Admin Only)

#### PATCH `/api/users/{id}/role`
Update user role (Admin, Staff, or Student).

**Request Body:**
```json
{
  "role": "STAFF"
}
```

**Response (200):** Updated user object with new role

#### POST `/api/users/{id}/deactivate`
Deactivate a user account.

**Response (200):**
```json
{
  "message": "User deactivated successfully"
}
```

#### POST `/api/users/{id}/activate`
Activate a deactivated user account.

**Response (200):**
```json
{
  "message": "User activated successfully"
}
```

### Notification Endpoints

#### GET `/api/notifications?userId=1&page=0&size=10`
Get all notifications for a user (paginated).

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Booking Approved",
      "message": "Your booking for Lecture Hall A has been approved",
      "type": "BOOKING_APPROVED",
      "read": false,
      "relatedResourceId": "123",
      "createdAt": "2026-04-24T10:00:00Z",
      "readAt": null
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 15,
  "totalPages": 2
}
```

#### GET `/api/notifications/unread?userId=1&page=0&size=10`
Get only unread notifications.

**Response (200):** Paginated list of unread notifications

#### GET `/api/notifications/unread-count?userId=1`
Get count of unread notifications.

**Response (200):**
```json
5
```

#### PATCH `/api/notifications/{id}/read`
Mark a single notification as read.

**Response (200):**
```json
{
  "id": 1,
  "title": "Booking Approved",
  "message": "Your booking for Lecture Hall A has been approved",
  "type": "BOOKING_APPROVED",
  "read": true,
  "relatedResourceId": "123",
  "createdAt": "2026-04-24T10:00:00Z",
  "readAt": "2026-04-24T11:00:00Z"
}
```

#### POST `/api/notifications/mark-all-read?userId=1`
Mark all notifications as read for a user.

**Response (200):** No content

#### DELETE `/api/notifications/{id}`
Delete a notification.

**Response (200):** No content

## Frontend Routes

### Public Routes
- `/login` - Login page with email/password support
- `/signup` - User registration page
- `/catalogue` - Resource catalogue (public)

### Protected Routes
- `/dashboard` - Dashboard (requires authentication)
- `/tickets` - Ticket management
- `/resources` - Resource management
- `/notifications` - Notifications center
- `/admin/roles` - Role management (admin only)

## Features Implemented

### Backend Features
✅ Email/Password Authentication
- User registration with validation
- Secure password hashing using BCrypt
- Login with email and password
- Optional Google OAuth support

✅ Notification System
- Create, read, update, delete notifications
- Mark single and bulk notifications as read
- Filter notifications (all/unread)
- Unread count tracking
- Notification types: BOOKING_APPROVED, BOOKING_REJECTED, TICKET_CREATED, TICKET_RESOLVED, COMMENT_ADDED, RESOURCE_AVAILABLE, GENERAL_ALERT

✅ Role Management
- Three role types: ADMIN, STAFF, STUDENT
- Admin endpoints to update user roles
- User activation/deactivation
- Role-based access control

### Frontend Features
✅ Improved Login Page
- Email and password input fields
- Password visibility toggle
- Error messaging
- Link to sign-up page
- Support for Google OAuth (if configured)
- Development mode mock login

✅ Sign-Up Page
- Form validation (name, email, password)
- Password confirmation field
- Show/hide password toggles
- Success state with auto-redirect to dashboard
- Error handling and display

✅ Notifications Page
- List all notifications with pagination
- Filter notifications (all vs unread only)
- Mark individual notifications as read
- Mark all notifications as read
- Delete notifications
- Type-based color coding
- Relative time display (e.g., "5m ago")
- Unread count indicator

✅ Role Management Page (Admin)
- View all users in a table
- Filter by role (Admin, Staff, Student)
- Filter by status (Active, Inactive)
- Update user roles (with modal)
- Activate/Deactivate users
- Admin-only access with permission checking

✅ Enhanced Layout
- Notifications bell in header
- Unread notification counter (badge)
- Role-aware menu items
- Refreshes unread count every 30 seconds
- Welcome message showing user name and role

## User Roles and Permissions

### STUDENT
- View resources and catalogue
- Create bookings
- Create support tickets
- View own notifications
- View own profile

### STAFF
- All Student permissions
- Manage resources (create, edit, delete)
- View and respond to tickets
- Manage bookings

### ADMIN
- All permissions
- Manage user roles and permissions
- Activate/deactivate users
- View role management dashboard
- Access admin features

## Notification Types

| Type | Trigger | Use Case |
|------|---------|----------|
| BOOKING_APPROVED | Booking accepted | User notified when booking is confirmed |
| BOOKING_REJECTED | Booking declined | User notified when booking is rejected |
| TICKET_CREATED | New ticket submitted | System notification for new tickets |
| TICKET_RESOLVED | Ticket resolved | User notified when their ticket is solved |
| COMMENT_ADDED | Comment on ticket | User notified when someone comments |
| RESOURCE_AVAILABLE | Resource becomes available | User notified when booked resource is ready |
| GENERAL_ALERT | General system message | System-wide announcements |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),  -- Nullable for OAuth users
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  google_id VARCHAR(255) UNIQUE,  -- Nullable for email/password users
  profile_picture_url VARCHAR(255),
  role ENUM('ADMIN', 'STAFF', 'STUDENT') NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('BOOKING_APPROVED', 'BOOKING_REJECTED', 'TICKET_CREATED', 'TICKET_RESOLVED', 'COMMENT_ADDED', 'RESOURCE_AVAILABLE', 'GENERAL_ALERT') NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  related_resource_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

## Testing Instructions

### Test Registration
```bash
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8081/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Get Notifications
```bash
curl http://localhost:8081/api/notifications?userId=1&page=0&size=10
```

### Test Mark as Read
```bash
curl -X PATCH http://localhost:8081/api/notifications/1/read
```

## Frontend Component Usage

### Login Page
```jsx
import LoginPage from './pages/LoginPage';
// Route: /login
```

### Sign-Up Page
```jsx
import SignUpPage from './pages/SignUpPage';
// Route: /signup
```

### Notifications Page
```jsx
import NotificationsPage from './pages/NotificationsPage';
// Route: /notifications (protected)
```

### Role Management Page
```jsx
import RoleManagementPage from './pages/RoleManagementPage';
// Route: /admin/roles (admin only)
```

## Security Considerations

1. **Password Security**: Passwords are hashed using BCrypt (10 salt rounds)
2. **CORS**: Configured for localhost:3000 and localhost:5173
3. **CSRF**: Disabled for development (should be enabled in production)
4. **Role-Based Access**: Frontend checks user role before rendering admin pages
5. **API Authentication**: Backend validates endpoints (though currently permissive for dev)

## Next Steps for Production

1. Implement JWT token generation and validation
2. Add refresh token mechanism
3. Implement proper role-based access control (RBAC) on backend
4. Reset exposed database credentials
5. Enable CSRF protection
6. Implement rate limiting
7. Add email verification for registration
8. Add password reset functionality
9. Implement audit logging for role changes
10. Add notification preferences/settings

---
**Member 4 Contributions:** Kaweesh  
**Branch:** Kaweesh  
**Commit:** 227c287  
**Features Completed:** 100%
