# SmartCampus Database Setup Guide - Shared Server

## For the Database Server Owner (You)

### 1. PostgreSQL Installation ✓ (Already Done)
- PostgreSQL is installed on your machine
- Database: `smartcampus`
- User: `smartcampus_user`
- Password: `password123`

### 2. Your Machine's IP Address
**Your IP:** `192.168.8.101` ✅

This is the IP address your team members will use to connect to the database server.

### 3. Configuration Files Updated
- ✅ postgresql.conf - listen_addresses = '*'
- ✅ pg_hba.conf - accepts remote connections
- ✅ PostgreSQL restarted

---

## For Team Members (Developers)

### Prerequisites
- Java 17+ installed
- Maven installed
- Internet connection to your network

### Step 1: Clone the Repository
```powershell
git clone <your-repo-url>
cd SmartCampus/backend
```

### Step 2: Connect to Shared Database

**Option A: Using Environment Variables (Recommended)**

**On Windows PowerShell:**
```powershell
$env:DB_HOST = "192.168.8.101"
$env:DB_PORT = "5432"
$env:DB_USER = "smartcampus_user"
$env:DB_PASSWORD = "password123"
mvn spring-boot:run
```

**Option B: Using Command Line Arguments**
```powershell
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
