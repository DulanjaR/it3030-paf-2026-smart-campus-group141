# SmartCampus - Team Setup Guide 🚀

**Team Members:** Dulanja (Lead), Kaweesh, Sahan, Nithu

---

## Quick Start (5 minutes)

### Prerequisites
- Java 17+ installed
- Maven installed
- Node.js 18+ installed
- npm installed

### 1. Clone Repository
```powershell
git clone <repo-url>
cd SmartCampus
```

### 2. Backend Setup
```powershell
cd backend

# Run the application
mvn spring-boot:run
```

**Backend runs on:** http://localhost:8081/api

### 3. Frontend Setup (New Terminal)
```powershell
cd frontend

# Install dependencies (first time only)
npm install

# Run development server
npm run dev
```

**Frontend runs on:** http://localhost:3000

### 4. Login & Test
- Open http://localhost:3000 in browser
- Click **"Login (Development Mode)"**
- You're in! ✅

---

## Database Configuration

### Cloud Database (Neon - Recommended) ⭐

**All team members use this automatically!**

| Property | Value |
|----------|-------|
| **Host** | ep-purple-truth-anxmcype.c-6.us-east-1.aws.neon.tech |
| **Database** | neondb |
| **Port** | 5432 |
| **Username** | neondb_owner |
| **Password** | npg_Fuo3PdzVJ1Ms |
| **Region** | AWS US-EAST-1 |

**Why cloud?**
- ✅ Works from anywhere
- ✅ No local setup needed
- ✅ Shared data across team
- ✅ No laptop needs to stay on

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│              http://localhost:3000                      │
│  - Dashboard, Resources, Bookings, Tickets             │
└──────────────────────┬──────────────────────────────────┘
                       │
                    AXIOS HTTP
                       │
┌──────────────────────▼──────────────────────────────────┐
│              BACKEND (Spring Boot)                      │
│              http://localhost:8081/api                  │
│  - REST API Controllers                                │
│  - Services (Business Logic)                           │
│  - JPA Repositories                                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                   JDBC/JPA
                       │
┌──────────────────────▼──────────────────────────────────┐
│      DATABASE (Neon PostgreSQL - Cloud)                │
│    ep-purple-truth-anxmcype.c-6.us-east-1...           │
│  - 7 Tables: users, resources, bookings,               │
│    tickets, comments, attachments, notifications       │
└─────────────────────────────────────────────────────────┘
```

---

## Running the Full Stack

### Option A: Two Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```powershell
cd SmartCampus/backend
mvn spring-boot:run

# Expected output after ~10 seconds:
# Started SmartCampusApiApplication
```

**Terminal 2 - Frontend:**
```powershell
cd SmartCampus/frontend
npm run dev

# Expected output:
# Local: http://localhost:3000/
```

### Option B: VS Code Split Terminal

1. Open VS Code
2. Open folder: SmartCampus
3. Open integrated terminal (Ctrl+`)
4. Split terminal (Ctrl+Shift+5)

**Left terminal:**
```powershell
cd backend; mvn spring-boot:run
```

**Right terminal:**
```powershell
cd frontend; npm run dev
```

---

## Profiles & Configurations

### Default Profile (Cloud Database)
```
mvn spring-boot:run

# Uses: application.yml (Neon cloud database)
# Works: Anywhere, anyone can use
```

### Local Profile (Optional - For Testing)
```
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"

# Uses: application-local.yml (localhost:5432)
# Requires: PostgreSQL 18 installed locally
# Use: Only if you want isolated local development
```

### H2 In-Memory (Optional - For Testing)
```
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=h2"

# Uses: application-h2.yml (in-memory database)
# Data: Lost on restart
# Use: Testing only
```

---

## Application Ports

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Frontend** | 3000 | http://localhost:3000 | React UI |
| **Backend** | 8081 | http://localhost:8081/api | REST API |
| **Database** | 5432 | ep-purple...neon.tech | Neon Cloud |

---

## API Endpoints Reference

### Resources
```
GET    /api/resources                 # Get all resources
GET    /api/resources/{id}            # Get single resource
POST   /api/resources                 # Create resource (admin)
PUT    /api/resources/{id}            # Update resource (admin)
DELETE /api/resources/{id}            # Delete resource (admin)
```

### Bookings
```
GET    /api/bookings                  # Get all bookings
GET    /api/bookings/{id}             # Get single booking
POST   /api/bookings                  # Create booking
PATCH  /api/bookings/{id}/approve     # Approve booking
PATCH  /api/bookings/{id}/reject      # Reject booking
PATCH  /api/bookings/{id}/cancel      # Cancel booking
```

### Tickets ⭐ (NEW)
```
GET    /api/tickets                   # Get all tickets
GET    /api/tickets/{id}              # Get ticket details
POST   /api/tickets                   # Create ticket
GET    /api/tickets/my-tickets        # Get my tickets
GET    /api/tickets/assigned-to       # Get assigned tickets
PATCH  /api/tickets/{id}/status       # Update status
POST   /api/tickets/{id}/assign       # Assign to technician
POST   /api/tickets/{id}/comments     # Add comment
POST   /api/tickets/{id}/attachments  # Upload image
```

---

## Troubleshooting

### "Connection refused" or Timeout
```
❌ Cannot connect to database

✅ Solutions:
1. Check internet connection
2. Check Neon service: https://neon.tech/status
3. Verify credentials are correct
4. Wait 30 seconds and retry
```

### "Port already in use"
```
❌ Port 8081 or 3000 already in use

✅ Solutions:
# Find process using port 8081
netstat -ano | findstr :8081

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### "mvn: command not found"
```
❌ Maven not in PATH

✅ Solutions:
1. Add C:\apache-maven-3.9.15\bin to Windows PATH
2. Restart PowerShell
3. Verify: mvn --version
```

### "npm install failed"
```
❌ Installation error

✅ Solutions:
1. Delete node_modules folder
2. Delete package-lock.json
3. Run: npm install
4. Wait for completion
```

### Frontend shows "Cannot connect to API"
```
❌ Frontend can't reach backend

✅ Solutions:
1. Verify backend is running (http://localhost:8081/api/actuator/health)
2. Check vite.config.js proxy configuration
3. Verify both servers are on same machine
4. Check firewall settings
```

---

## Database Tables

All 7 tables are auto-created:

```sql
✅ users          -- User accounts & profiles
✅ resources      -- Campus resources (classrooms, labs, equipment)
✅ bookings       -- Resource booking requests
✅ tickets        -- Support tickets
✅ comments       -- Ticket comments/updates
✅ attachments    -- Ticket file attachments
✅ notifications  -- User notifications
```

**No manual setup needed!** Hibernate creates everything automatically on first run.

---

## Git Workflow

### Clone the Repo
```powershell
git clone https://github.com/<org>/SmartCampus.git
cd SmartCampus
```

### Create Your Branch
```powershell
git checkout -b feature/<feature-name>

# Examples:
git checkout -b feature/resource-listing
git checkout -b feature/booking-approval
git checkout -b feature/ticket-dashboard
```

### Commit Your Changes
```powershell
git add .
git commit -m "Add: Feature description"
git push origin feature/<feature-name>
```

### Pull Latest Changes
```powershell
git pull origin main
```

---

## Team Assignment

| Member | Focus Area | Endpoints |
|--------|-----------|-----------|
| **Dulanja** | Project Lead | Setup, Database, CI/CD |
| **Kaweesh** | Resources Module | /api/resources |
| **Sahan** | Bookings Module | /api/bookings |
| **Nithu** | Tickets Module | /api/tickets |

---

## Communication & Support

### Questions?
- 💬 Slack: #smartcampus-dev
- 📧 Email: team@smartcampus.edu
- 🐛 Issues: GitHub Issues
- 📋 Documentation: See ARCHITECTURE.md

### Daily Standup
- Time: 9:00 AM (Mon-Fri)
- Duration: 15 minutes
- Format: What you did, what's blocked, what's next

---

## Checklist: Getting Started

- [ ] Clone repository
- [ ] Java 17+ installed
- [ ] Maven installed
- [ ] Node.js 18+ installed
- [ ] Backend runs on 8081
- [ ] Frontend runs on 3000
- [ ] Can login to application
- [ ] Created your feature branch
- [ ] Read ARCHITECTURE.md

---

## Important Notes

⚠️ **Keep Credentials Safe**
- Never commit credentials to Git
- Use `.env` files for secrets
- Never share credentials in chat/email
- Report suspicious access immediately

📋 **Code Standards**
- Use meaningful variable/method names
- Add comments for complex logic
- Follow existing code style
- Write unit tests for new features

🔒 **Security**
- Never log sensitive data
- Use parameterized queries
- Validate all user input
- Report security issues privately

---

## Next Steps

1. **Setup Phase** (Everyone - Same Day)
   - [ ] Clone repo
   - [ ] Run backend
   - [ ] Run frontend
   - [ ] Verify login works

2. **Familiarization** (Day 1-2)
   - [ ] Read ARCHITECTURE.md
   - [ ] Read API_DOCUMENTATION.md
   - [ ] Explore existing code
   - [ ] Review team assignments

3. **Development** (Day 3+)
   - [ ] Create feature branch
   - [ ] Build your module
   - [ ] Write tests
   - [ ] Submit pull request

4. **Deployment** (TBD)
   - [ ] Code review
   - [ ] Integration testing
   - [ ] Production deployment

---

## Quick Reference Commands

```powershell
# Backend
cd backend
mvn clean install          # Full rebuild
mvn spring-boot:run        # Run application
mvn test                   # Run tests
mvn compile                # Just compile

# Frontend
cd frontend
npm install                # Install dependencies
npm run dev                # Development server
npm run build              # Production build
npm run preview            # Preview production build
npm run lint               # Check code style

# Git
git status                 # Check status
git pull origin main       # Get latest
git push origin branch     # Push changes
git log --oneline          # View commit history
```

---

## Resources

- 📖 [Spring Boot Docs](https://spring.io/projects/spring-boot)
- ⚛️ [React Docs](https://react.dev)
- 🗄️ [PostgreSQL Docs](https://www.postgresql.org/docs/)
- 🔄 [REST Best Practices](https://restfulapi.net/)
- 🏗️ [Architecture Decision Records](./ARCHITECTURE.md)

---

**Welcome to SmartCampus! Let's build something great together! 🚀**

Last Updated: April 23, 2026
