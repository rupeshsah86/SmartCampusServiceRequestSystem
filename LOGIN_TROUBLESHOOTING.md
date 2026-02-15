# 🔧 Login Issue Troubleshooting Guide

## Problem: Login Not Working / Nothing Showing

### Root Cause Analysis
The login issue occurs when the **backend server is not running** on port 8000. The frontend tries to connect but fails silently.

---

## ✅ Quick Fix Steps

### 1. **Start MongoDB** (if not running)
```bash
# Check if MongoDB is running
pgrep -l mongod

# If not running, start it:
brew services start mongodb-community
# OR
mongod --config /usr/local/etc/mongod.conf
```

### 2. **Start Backend Server**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running in development mode on port 8000
MongoDB Connected: localhost
```

### 3. **Start Frontend Server** (in a new terminal)
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

### 4. **Use the Startup Script** (Easiest Method)
```bash
# From project root
./start-dev.sh
```

---

## 🔍 Verification Steps

### Check Backend is Running:
```bash
curl http://localhost:8000/api
```

**Expected Response:**
```json
{
  "message": "Smart Campus Service Request System API",
  "version": "1.0.0",
  "status": "Running"
}
```

### Check Frontend is Running:
Open browser: `http://localhost:3000`

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Cause:** Backend not running  
**Solution:** Start backend server (see step 2 above)

### Issue 2: "MongoDB connection failed"
**Cause:** MongoDB not running  
**Solution:** Start MongoDB (see step 1 above)

### Issue 3: Port 8000 already in use
**Cause:** Another process using port 8000  
**Solution:**
```bash
# Find process using port 8000
lsof -ti:8000

# Kill the process
kill -9 $(lsof -ti:8000)

# Then restart backend
cd backend && npm run dev
```

### Issue 4: Port 3000 already in use
**Cause:** Another process using port 3000  
**Solution:**
```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Then restart frontend
cd frontend && npm start
```

### Issue 5: "Invalid credentials" error
**Cause:** User doesn't exist or wrong password  
**Solution:** 
- Register a new account first
- Or use seed data: `cd backend && node scripts/seedData.js`

### Issue 6: CORS errors in browser console
**Cause:** Backend CORS not configured for frontend URL  
**Solution:** Already configured in `backend/server.js` for localhost:3000

---

## 📋 Pre-Login Checklist

Before attempting to login, ensure:

- [ ] MongoDB is running (`pgrep -l mongod`)
- [ ] Backend server is running on port 8000
- [ ] Frontend server is running on port 3000
- [ ] No console errors in browser (F12 → Console)
- [ ] Network tab shows API calls (F12 → Network)
- [ ] User account exists (register first if new)

---

## 🎯 Testing Login Flow

### 1. Register a Test User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "test123",
    "role": "student",
    "department": "Computer Science",
    "phone": "1234567890"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

---

## 🔐 Default Test Accounts

After running seed data (`node scripts/seedData.js`):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Student | student@campus.edu | student123 |
| Faculty | faculty@campus.edu | faculty123 |
| Technician | tech@campus.edu | tech123 |

---

## 📱 Browser Console Debugging

Open browser console (F12) and check for:

### Network Errors:
- `ERR_CONNECTION_REFUSED` → Backend not running
- `ERR_NETWORK` → Backend not reachable
- `401 Unauthorized` → Invalid credentials
- `500 Internal Server Error` → Backend error

### Console Errors:
- Check for any red error messages
- Look for API call failures
- Verify token storage in localStorage

---

## 🚀 Improvements Made

### 1. **Enhanced Error Messages**
- Clear message when backend is not running
- Network error detection
- User-friendly error display

### 2. **Better Error Handling**
- AuthContext now catches network errors
- Login page shows all error types
- Improved error visibility with icons

### 3. **Visual Improvements**
- Error alerts now have warning icons
- Smooth animations for error messages
- Better color contrast for accessibility

### 4. **Developer Tools**
- Startup script for easy server launch
- This troubleshooting guide
- Better console logging

---

## 📞 Still Having Issues?

1. Check backend logs for errors
2. Check browser console (F12)
3. Verify .env files are configured correctly
4. Ensure all npm packages are installed:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

---

## ✨ Success Indicators

When everything works correctly:

1. ✅ Backend shows: "Server running on port 8000"
2. ✅ Frontend opens at http://localhost:3000
3. ✅ Login page loads without errors
4. ✅ Entering credentials shows loading spinner
5. ✅ Successful login redirects to dashboard
6. ✅ User info appears in dashboard

---

**Last Updated:** $(date)
**Version:** 1.0.0
