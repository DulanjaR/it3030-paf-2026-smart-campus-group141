# SmartCampus Database Setup Guide - Cloud Edition

## 🎉 Database is Now on Cloud (Neon)!

Your database is hosted on **Neon** (PostgreSQL in the cloud). No local installation needed for your teammates!

---

## For All Team Members (Quick Start)

### Option A: Use Cloud Database (RECOMMENDED) ✅

The app is already configured to use the cloud database by default.

**Just run:**
```powershell
cd SmartCampus/backend
mvn spring-boot:run
```

The app will automatically connect to the Neon cloud database.

**Benefits:**
- ✅ No setup needed
- ✅ Works from anywhere (home, office, anywhere)
- ✅ No laptop needs to be on
- ✅ Shared database (everyone sees same data)
- ✅ Free tier available

---

### Option B: Use Local PostgreSQL (Optional)

If you prefer a local database (development/testing only):

1. **Install PostgreSQL locally** from https://www.postgresql.org/download/
2. **Create database:**
   ```powershell
   psql -U postgres -c "CREATE DATABASE smartcampus;"
   psql -U postgres -c "CREATE USER smartcampus_user WITH PASSWORD 'password123';"
   psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE smartcampus TO smartcampus_user;"
   ```

3. **Run with local profile:**
   ```powershell
   mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
   ```

---

## Cloud Database Details (Neon)

| Property | Value |
|----------|-------|
| **Host** | ep-purple-truth-anxmcype.c-6.us-east-1.aws.neon.tech |
| **Database** | neondb |
| **Port** | 5432 |
| **Username** | neondb_owner |
| **Password** | npg_Fuo3PdzVJ1Ms |
| **Connection String** | postgresql://neondb_owner:npg_Fuo3PdzVJ1Ms@ep-purple-truth-anxmcype.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require |

---

## Tables Available

All 7 tables are created and ready:
- ✅ users
- ✅ resources
- ✅ bookings
- ✅ tickets
- ✅ comments
- ✅ attachments
- ✅ notifications

---

## Running the Application

### Clone Repository
```powershell
git clone <repo-url>
cd SmartCampus/backend
```

### Run Application (Cloud Database)
```powershell
mvn spring-boot:run
```

### Access API
- **Base URL:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/api/actuator/health

---

## Troubleshooting

### "Connection refused" or "Connection timeout"
- Check your internet connection
- Verify Neon service is up: https://neon.tech/status
- Try again in a few seconds

### "password authentication failed"
- Check password is correct: `npg_Fuo3PdzVJ1Ms`
- Verify username: `neondb_owner`

### "SSL certificate rejected"
- This is normal for Neon
- The connection string handles it with `sslmode=require`

### Want to test connection manually?
```powershell
# Install PostgreSQL tools first
psql -h ep-purple-truth-anxmcype.c-6.us-east-1.aws.neon.tech \
     -U neondb_owner \
     -d neondb
```
Password: `npg_Fuo3PdzVJ1Ms`

---

## Available Profiles

Run with different profiles:

```powershell
# Cloud Database (Default - Recommended)
mvn spring-boot:run

# Local PostgreSQL (if installed locally)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"

# H2 In-Memory (Testing only)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=h2"
```

---

## File Structure

```
SmartCampus/backend/src/main/resources/
├── application.yml              # Cloud config (default)
├── application-local.yml        # Local PostgreSQL config
├── application-h2.yml           # H2 in-memory config
└── application-postgres.yml     # Remote PostgreSQL (legacy)
```

---

## Important Notes

⚠️ **KEEP CREDENTIALS PRIVATE**
- Don't commit credentials to Git
- Use environment variables for sensitive data
- Consider using `.env` files (add to `.gitignore`)

📝 **For Production**
- Switch to a managed database service
- Use environment variables for all secrets
- Enable SSL/TLS
- Regular backups

---

## Support

For questions or issues, contact the team lead (Dulanja).

Happy coding! 🚀
mvn spring-boot:run `
  -Dspring-boot.run.arguments="--spring.datasource.url=jdbc:postgresql://192.168.8.101:5432/smartcampus `
  --spring.datasource.username=smartcampus_user `
  --spring.datasource.password=password123"
```

**Option C: Modify application.yml (Not Recommended)**

Edit `backend/src/main/resources/application.yml`:
```yaml
datasource:
  url: jdbc:postgresql://192.168.8.101:5432/smartcampus
  username: smartcampus_user
  password: password123
```

### Step 3: Run the Application
```powershell
mvn clean compile
mvn spring-boot:run
```

### Step 4: Test Connection
If you see this in logs, you're connected! ✅
```
... (0m0.000s) create table users (...)
... (0m0.000s) create table resources (...)
```

---

## Troubleshooting

### "Connection refused"
- Check if server machine is running
- Check firewall isn't blocking port 5432
- Verify IP address is correct: `ping 192.168.1.100`

### "authentication failed"
- Check username/password are correct
- Verify `pg_hba.conf` has the md5 line

### Test Connection Manually
```powershell
psql -h 192.168.8.101 -U smartcampus_user -d smartcampus
```

---

## Network Issues?

If team members can't reach the server:

1. **Check Firewall:**
   - Windows Firewall might block PostgreSQL
   - Allow PostgreSQL through firewall

2. **Verify you can reach server:**
   ```powershell
   ping 192.168.8.101
   ```

3. **Check Server Status:**
   ```powershell
   netstat -an | findstr 5432
   ```

4. **Restart PostgreSQL:**
   ```powershell
   net stop postgresql-x64-18
   net start postgresql-x64-18
   ```

---

## Switching Back to Local Database

If you want to use local H2 instead:
```powershell
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=h2"
```

---
8.101
## Database Info

| Property | Value |
|----------|-------|
| Host | 192.168.1.100 |
| Port | 5432 |
| Database | smartcampus |
| Username | smartcampus_user |
| Password | password123 |
| Tables | 7 (users, resources, bookings, tickets, comments, attachments, notifications) |
