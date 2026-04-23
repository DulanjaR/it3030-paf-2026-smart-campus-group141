# SmartCampus - Quick Start Card 🎯

**Paste this in Slack/Email for teammates**

---

## 5-Minute Setup

```
1. git clone <repo-url> && cd SmartCampus

2. Terminal 1:
   cd backend
   mvn spring-boot:run

3. Terminal 2:
   cd frontend
   npm install
   npm run dev

4. Open http://localhost:3000 → Login ✅
```

---

## Connection Details

| Item | Value |
|------|-------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8081/api |
| Database | Neon Cloud (Shared) |
| DB User | neondb_owner |
| DB Pass | npg_Fuo3PdzVJ1Ms |
| DB Host | ep-purple-truth-anxmcype.c-6.us-east-1.aws.neon.tech |

---

## No Setup Needed!
✅ Database tables auto-created
✅ Uses cloud database (works anywhere)
✅ All credentials configured
✅ Ready to code!

---

## Key Files

```
backend/
  src/main/java/com/smartcampus/api/
    ├── entity/           (Database models)
    ├── repository/       (Database access)
    ├── service/          (Business logic)
    └── controller/       (REST endpoints)

frontend/
  src/
    ├── pages/            (Page components)
    ├── components/       (Reusable UI)
    ├── services/         (API calls)
    └── store/            (State management)
```

---

## APIs Available

**Resources** → `GET /api/resources`
**Bookings** → `GET /api/bookings`
**Tickets** → `GET /api/tickets` ⭐ NEW
**Users** → `GET /api/users`

---

## Branches

Create your own:
```
git checkout -b feature/<your-name>
```

Examples:
- feature/kaweesh
- feature/sahan
- feature/nithu

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `taskkill /PID <pid> /F` |
| mvn not found | Add Maven to PATH |
| npm error | Delete node_modules, run `npm install` |
| DB timeout | Check internet, wait 30s |

---

## Need Help?

1. Check TEAM_ONBOARDING.md (full guide)
2. Read ARCHITECTURE.md (system design)
3. See TICKET_API_DOCUMENTATION.md (API docs)
4. Ask Dulanja in Slack

---

**Let's go! 🚀**
