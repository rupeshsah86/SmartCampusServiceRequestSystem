# 🚀 STARTUP & LOGIN FIX GUIDE

## ✅ FIXES APPLIED

1. **Register Page** - Removed confirm password field
2. **Login Issue** - Verified authentication flow
3. **Simplified Registration** - Single password field only

---

## 🏃 HOW TO START THE APPLICATION

### **Step 1: Start MongoDB**
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
brew services start mongodb-community
# OR
mongod --dbpath /path/to/data
```

### **Step 2: Start Backend**
```bash
# Terminal 1
cd backend
npm install
npm run dev
```

**Expected Output:**
```
Server running in development mode on port 8000
MongoDB Connected: localhost
```

### **Step 3: Start Frontend**
```bash
# Terminal 2
cd frontend
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

## 🔐 TEST LOGIN

### **Option 1: Use Seed Data**
```bash
# Terminal 3
cd backend
npm run seed
```

**Test Credentials:**
- **Admin:** admin@campus.edu / admin123
- **Student:** john.student@campus.edu / student123
- **Faculty:** sarah.faculty@campus.edu / faculty123
- **Technician:** mike.tech@campus.edu / tech123

### **Option 2: Register New User**
1. Go to http://localhost:3000
2. Click "Get Started" or "Register"
3. Fill form:
   - Name: Your Name
   - Email: your@email.com
   - Password: yourpass123 (min 6 characters)
   - Role: Student/Faculty/Technician
   - Department: Your Department
   - Phone: 1234567890 (10 digits)
   - Student/Employee ID: Your ID
4. Click "Create Account"
5. You'll be logged in automatically

---

## 🐛 TROUBLESHOOTING

### **Issue 1: Login Not Working**

**Symptoms:**
- White page after login
- "Invalid credentials" error
- Nothing happens

**Solutions:**

1. **Clear Browser Cache:**
```javascript
// Open browser console (F12) and run:
localStorage.clear();
// Then refresh page
```

2. **Check Backend is Running:**
```bash
curl http://localhost:8000/
# Should return: {"message":"Smart Campus Service Request System API"}
```

3. **Check MongoDB is Running:**
```bash
mongosh
# Should connect successfully
```

4. **Restart Backend:**
```bash
# Stop backend (Ctrl+C)
cd backend
npm run dev
```

5. **Check Console for Errors:**
- Open browser DevTools (F12)
- Go to Console tab
- Look for red errors
- Check Network tab for failed requests

---

### **Issue 2: Register Not Working**

**Solutions:**

1. **Check All Fields:**
   - Name (min 2 characters)
   - Email (valid format)
   - Password (min 6 characters)
   - Department (not empty)
   - Phone (exactly 10 digits)
   - Student/Employee ID (required)

2. **Email Already Exists:**
   - Use different email
   - Or delete user from database:
```bash
mongosh
use smart_campus_db
db.users.deleteOne({email: "your@email.com"})
```

---

### **Issue 3: Backend Not Starting**

**Solutions:**

1. **Port Already in Use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

2. **MongoDB Not Connected:**
```bash
# Start MongoDB
brew services start mongodb-community
```

3. **Missing Dependencies:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### **Issue 4: Frontend Not Starting**

**Solutions:**

1. **Port 3000 in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

2. **Missing Dependencies:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ VERIFICATION CHECKLIST

Before testing login:

- [ ] MongoDB is running
- [ ] Backend is running on port 8000
- [ ] Frontend is running on port 3000
- [ ] No console errors in browser
- [ ] Network tab shows API calls
- [ ] Browser cache cleared

---

## 🎯 QUICK TEST

### **Test Backend:**
```bash
cd smart-campus-system
./test-backend.sh
```

### **Test Frontend:**
1. Open http://localhost:3000
2. Should see landing page
3. Click "Login"
4. Should see login form
5. Enter credentials
6. Should redirect to dashboard

---

## 📝 REGISTRATION FORM (NEW - NO CONFIRM PASSWORD)

**Fields:**
1. Account Type (Student/Faculty/Technician)
2. Full Name
3. Email Address
4. Password (single field - min 6 characters)
5. Department
6. Phone Number (10 digits)
7. Student ID (if student) OR Employee ID (if faculty/technician)

**No more confirm password field!**

---

## 🔑 PASSWORD REQUIREMENTS

- Minimum 6 characters
- No special requirements
- Simple and easy

---

## 🎓 FOR TESTING

### **Quick Register:**
```
Name: Test User
Email: test@test.com
Password: test123
Role: Student
Department: CS
Phone: 1234567890
Student ID: TEST001
```

### **Quick Login:**
```
Email: test@test.com
Password: test123
```

---

## 📞 STILL NOT WORKING?

1. **Check Backend Logs:**
   - Look at Terminal 1 (backend)
   - Check for error messages

2. **Check Frontend Console:**
   - Press F12
   - Look at Console tab
   - Check Network tab

3. **Restart Everything:**
```bash
# Stop all (Ctrl+C in each terminal)
# Start MongoDB
brew services restart mongodb-community
# Start Backend
cd backend && npm run dev
# Start Frontend
cd frontend && npm start
```

4. **Fresh Start:**
```bash
# Clear database
mongosh
use smart_campus_db
db.dropDatabase()
exit

# Restart backend
cd backend
npm run seed
npm run dev
```

---

## ✅ SUCCESS INDICATORS

**Backend Running:**
```
✅ Server running in development mode on port 8000
✅ MongoDB Connected: localhost
```

**Frontend Running:**
```
✅ Compiled successfully!
✅ webpack compiled with 0 errors
```

**Login Working:**
```
✅ Redirects to dashboard
✅ Shows user name in header
✅ Displays statistics
✅ No console errors
```

---

**Everything should work now! 🎉**