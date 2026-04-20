# Smart Campus Project Setup Checklist

## Initial Setup ✓

- [x] Create project folder structure
- [x] Initialize Git repository
- [x] Create backend (Spring Boot) configuration
- [x] Create frontend (React/Vite) configuration
- [x] Set up GitHub Actions CI/CD pipeline
- [x] Create documentation files

## Backend Development Tasks

### Phase 1: Core Setup
- [ ] Configure application properties for development
- [ ] Set up database (H2 for dev, PostgreSQL for prod)
- [ ] Create JPA entities:
  - [ ] User entity with roles
  - [ ] Resource entity with metadata
  - [ ] Booking entity with status workflow
  - [ ] Ticket entity with attachments
  - [ ] Comment entity with ownership
  - [ ] Notification entity
  - [ ] Attachment entity

### Phase 2: Authentication & Authorization
- [ ] Implement OAuth 2.0 with Google
- [ ] Create JWT token generation/validation
- [ ] Set up role-based access control (RBAC)
- [ ] Implement security annotations
- [ ] Create custom security exceptions
- [ ] Configure CORS properly

### Phase 3: Core Endpoints (Member-based allocation)

#### Member 1: Resources Module
- [ ] `GET /api/resources` - List with pagination/filters
- [ ] `GET /api/resources/{id}` - Get details
- [ ] `POST /api/resources` - Create (admin only)
- [ ] `PUT /api/resources/{id}` - Update (admin only)
- [ ] `DELETE /api/resources/{id}` - Delete (admin only)
- [ ] Search and filtering service
- [ ] Resource availability check

#### Member 2: Booking Module
- [ ] `GET /api/bookings` - List with filters
- [ ] `POST /api/bookings` - Create booking
- [ ] `GET /api/bookings/{id}` - Get booking details
- [ ] `PUT /api/bookings/{id}` - Update booking
- [ ] `PATCH /api/bookings/{id}/approve` - Admin approval
- [ ] `PATCH /api/bookings/{id}/reject` - Admin rejection
- [ ] `PATCH /api/bookings/{id}/cancel` - User cancellation
- [ ] Conflict detection logic
- [ ] Booking workflow state machine

#### Member 3: Ticket Module
- [ ] `GET /api/tickets` - List with filters
- [ ] `POST /api/tickets` - Create with file upload (up to 3 images)
- [ ] `GET /api/tickets/{id}` - Get details
- [ ] `PUT /api/tickets/{id}` - Update ticket
- [ ] `PATCH /api/tickets/{id}/status` - Update status
- [ ] `POST /api/tickets/{id}/comments` - Add comment
- [ ] File upload/validation service
- [ ] Comment ownership rules
- [ ] Ticket workflow state machine

#### Member 4: Notifications Module
- [ ] `GET /api/notifications` - List user notifications
- [ ] `PATCH /api/notifications/{id}` - Mark as read
- [ ] `POST /api/auth/login` - OAuth login endpoint
- [ ] `GET /api/auth/me` - Current user info
- [ ] `POST /api/auth/logout` - Logout
- [ ] Real-time notification service (future enhancement)
- [ ] Notification preferences

### Phase 4: Testing
- [ ] Unit tests for services
- [ ] Integration tests for repositories
- [ ] Controller tests with MockMvc
- [ ] Security tests
- [ ] API contract tests

## Frontend Development Tasks

### Phase 1: Project Setup
- [ ] Install dependencies (npm install)
- [ ] Configure environment variables
- [ ] Set up Tailwind CSS
- [ ] Configure React Router
- [ ] Set up Zustand stores

### Phase 2: Authentication UI
- [ ] Login page with Google OAuth
- [ ] Protected route component
- [ ] Session management
- [ ] Logout functionality
- [ ] Token refresh mechanism

### Phase 3: Core Pages & Components

#### Member 1: Resources
- [ ] Resource list page with filters
- [ ] Resource detail page
- [ ] Resource creation form (admin)
- [ ] Resource update form (admin)
- [ ] Search functionality
- [ ] Responsive resource grid

#### Member 2: Bookings
- [ ] Booking list page
- [ ] Booking creation form
- [ ] Calendar view for bookings
- [ ] Booking approval interface (admin)
- [ ] Conflict warning display
- [ ] Booking cancellation flow

#### Member 3: Tickets
- [ ] Ticket list page with filters
- [ ] Ticket creation form with image upload
- [ ] Image preview before upload
- [ ] Ticket detail page with comments
- [ ] Comment section with edit/delete
- [ ] Status update interface
- [ ] Technician assignment interface

#### Member 4: Notifications & Dashboard
- [ ] Dashboard page with statistics
- [ ] Notifications panel
- [ ] Notification bell icon with count
- [ ] Navigation layout
- [ ] User menu
- [ ] Responsive sidebar

### Phase 4: Styling & UX
- [ ] Responsive design for mobile/tablet/desktop
- [ ] Loading states
- [ ] Error handling and display
- [ ] Success messages
- [ ] Form validation UI feedback
- [ ] Accessibility (ARIA labels, etc.)

### Phase 5: Testing
- [ ] Component unit tests
- [ ] Service tests
- [ ] Integration tests
- [ ] E2E test scenarios

## Git & Version Control

- [ ] Initialize GitHub repository
- [ ] Set up branch protection rules
- [ ] Create develop branch
- [ ] Create feature branches for each member
- [ ] Establish commit message conventions
- [ ] Set up pull request templates
- [ ] Create first commit with initial setup

## Documentation

- [x] Create README.md
- [x] Create ARCHITECTURE.md
- [x] Create TEAM_CONTRIBUTION.md
- [ ] Create API documentation (OpenAPI/Swagger)
- [ ] Create database schema documentation
- [ ] Create setup troubleshooting guide

## Deployment (Optional)

- [ ] Docker configuration for backend
- [ ] Docker configuration for frontend
- [ ] Docker Compose for local development
- [ ] Cloud deployment setup
- [ ] Environment-specific configurations

## Code Quality & Standards

- [ ] Set up ESLint for frontend
- [ ] Set up Prettier for code formatting
- [ ] Configure Maven for backend code quality
- [ ] Set up pre-commit hooks
- [ ] Code review checklist

## Final Checklist Before Submission

- [ ] All core features implemented
- [ ] All endpoints tested and documented
- [ ] UI/UX is polished and responsive
- [ ] Authentication working with OAuth
- [ ] Database properly configured
- [ ] Error handling implemented
- [ ] Input validation on frontend and backend
- [ ] Git history is clean and meaningful
- [ ] README is complete and accurate
- [ ] Team contributions are documented
- [ ] Final report prepared
- [ ] Screenshots/evidence collected
- [ ] Code commented and clean

---

**Next Steps**:
1. Set up your development environment
2. Install all dependencies
3. Configure your IDE/editor
4. Create your GitHub repository
5. Add team members to the project
6. Assign modules to team members
7. Begin implementation following the checklist

**Submission Deadline**: 27th April 2026, 11:45 PM GMT +5:30
