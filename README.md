# Smart Campus Operations Hub

A comprehensive web platform for managing facility and asset bookings, as well as maintenance and incident handling for university campuses.

## Project Overview

**Smart Campus** is a modern, production-inspired web system designed for university operations management. It provides:

- **Facilities & Assets Catalogue**: Maintain and search bookable resources (lecture halls, labs, meeting rooms, equipment)
- **Booking Management**: Request, approve, and manage resource bookings with conflict detection
- **Maintenance & Incident Ticketing**: Create, track, and resolve facility issues with image attachments
- **Notifications**: Real-time notifications for bookings, tickets, and comments
- **Role-Based Access Control**: USER and ADMIN roles with OAuth 2.0 authentication

## Tech Stack

### Backend
- **Java 17** with Spring Boot 3.2.0
- **Spring Security** with OAuth 2.0 (Google Sign-In)
- **Spring Data JPA** for database access
- **H2 Database** (development) / PostgreSQL (production)
- **Maven** for dependency management

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Google OAuth** for authentication

### Version Control & CI/CD
- **Git** with GitHub
- **GitHub Actions** for automated build and test workflows

## Project Structure

```
SmartCampus/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smartcampus/api/
│   │   │   │   ├── SmartCampusApiApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── HealthController.java
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   └── dto/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── application-postgres.yml
│   │   └── test/
│   ├── pom.xml
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/
│   │   │   ├── apiClient.js
│   │   │   └── apiServices.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .gitignore
├── .github/
│   └── workflows/
│       └── build-test.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- **JDK 17+** for backend
- **Node.js 18+** for frontend
- **Maven 3.8+** for building
- **npm** or **yarn** for frontend dependencies
- **PostgreSQL 12+** (optional, for production database)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and build:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

4. The API will be available at `http://localhost:8080/api`

5. Check health status:
   ```bash
   curl http://localhost:8080/api/public/health
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Google OAuth Client ID

5. Start the development server:
   ```bash
   npm run dev
   ```

6. The application will be available at `http://localhost:3000`

## Configuration

### Environment Variables

#### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

#### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:smartcampus  # Development
    # url: jdbc:postgresql://localhost:5432/smartcampus  # Production
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with Google OAuth token
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/refresh` - Refresh authentication token

### Resources
- `GET /api/resources` - List all resources with filters
- `GET /api/resources/{id}` - Get resource details
- `POST /api/resources` - Create new resource (Admin only)
- `PUT /api/resources/{id}` - Update resource (Admin only)
- `DELETE /api/resources/{id}` - Delete resource (Admin only)

### Bookings
- `GET /api/bookings` - List bookings
- `GET /api/bookings/{id}` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `PATCH /api/bookings/{id}/approve` - Approve booking (Admin)
- `PATCH /api/bookings/{id}/reject` - Reject booking (Admin)
- `PATCH /api/bookings/{id}/cancel` - Cancel booking

### Tickets
- `GET /api/tickets` - List tickets
- `GET /api/tickets/{id}` - Get ticket details
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/{id}` - Update ticket
- `PATCH /api/tickets/{id}/status` - Update ticket status
- `POST /api/tickets/{id}/comments` - Add comment

### Public Endpoints
- `GET /api/public/health` - Health check
- `GET /api/public/info` - API information

## Building & Deployment

### Build Backend
```bash
cd backend
mvn clean package
```

### Build Frontend
```bash
cd frontend
npm run build
```

The frontend build artifacts will be in `frontend/dist/`.

### Run Tests

**Backend Tests:**
```bash
cd backend
mvn test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

## CI/CD Pipeline

The project includes GitHub Actions workflows for:
- Automated build on push and pull requests
- Running unit tests
- Code quality checks
- Building and packaging artifacts

Workflow file: `.github/workflows/build-test.yml`

## Team Contribution

Each team member should implement:
- **Member 1**: Facilities catalogue + resource management endpoints
- **Member 2**: Booking workflow + conflict checking
- **Member 3**: Incident tickets + attachments + technician updates
- **Member 4**: Notifications + role management + OAuth integration

Ensure clear commit history and documentation of your contributions.

## Academic Integrity

This project requires:
- Individual implementation of assigned components
- Clear documentation of AI usage (if any)
- Ability to explain your code during viva
- Meaningful commit history reflecting actual development

## License

This project is part of IT3030 - Programming Applications and Frameworks (2026) at SLIIT.

## Support & Documentation

For assignment details, see:
- `IT3030_PAF_Assignment_2026_Marking_Rubric.pdf`
- `PAF_Assignment-2026.pdf`

## Submission

**Deadline**: 27th April 2026, 11:45 PM GMT +5:30

**Submission includes**:
1. GitHub repository (public or accessible to evaluators)
2. Final report (PDF): `IT3030_PAF_Assignment_2026_GroupXX.pdf`
3. Source code with clean commit history
4. README with setup instructions
5. Evidence of testing (screenshots/Postman collections)

---

**Last Updated**: April 2026
