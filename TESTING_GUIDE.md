# 🧪 TESTING & DEMONSTRATION GUIDE

## 🎯 PRE-DEMO CHECKLIST

### 1. Environment Setup
```bash
# Check Node.js version
node --version  # Should be v14+

# Check MongoDB status
mongosh  # Should connect successfully

# Check ports availability
lsof -i :3000  # Frontend port
lsof -i :8000  # Backend port
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Environment Variables
```bash
# Backend .env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/smart_campus_db
JWT_SECRET=SmartCampus2024_SecureKey_ProductionReady_ChangeInProduction_987654321
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

# Frontend .env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Smart Campus System
```

---

## 🚀 STARTING THE APPLICATION

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
**Expected Output:**
```
Server running in development mode on port 8000
MongoDB Connected: localhost
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

### Terminal 3 - Seed Data (Optional)
```bash
cd backend
npm run seed
```
**Expected Output:**
```
🗑️  Cleared existing data
👥 Created sample users
📋 Created sample service requests
✅ Seed data created successfully!
```

---

## 🎬 DEMONSTRATION FLOW (10 Minutes)

### **Part 1: Landing Page & Registration (2 min)**

1. **Open Browser:** http://localhost:3000
2. **Show Landing Page:**
   - Hero section with tagline
   - Features overview
   - How it works (3 steps)
   - Role explanations
   - Professional design

3. **Click "Get Started"** → Registration Page
4. **Register as Student:**
   - Name: "Demo Student"
   - Email: "demo.student@campus.edu"
   - Password: "demo123"
   - Role: Student
   - Department: "Computer Science"
   - Phone: "9876543210"
   - Student ID: "CS2024999"
   - Click "Create Account"

**Expected:** Redirect to Student Dashboard

---

### **Part 2: Student Dashboard (2 min)**

1. **Show Dashboard Features:**
   - Statistics cards (Total, Pending, In Progress, Resolved)
   - "New Request" button
   - Request listing
   - Filters (Status, Category)

2. **Create New Request:**
   - Click "New Request"
   - Title: "Projector Not Working in Lab"
   - Description: "The projector in Computer Lab 301 is not turning on"
   - Category: "IT Support"
   - Priority: "High"
   - Location: "Computer Lab 301"
   - Click "Submit Request"

**Expected:** Success message, redirect to dashboard, new request visible

3. **Show Request Details:**
   - Click on the newly created request
   - Show request ID, status, priority
   - Show all details

---

### **Part 3: Admin Dashboard (3 min)**

1. **Logout** from student account
2. **Login as Admin:**
   - Email: "admin@campus.edu"
   - Password: "admin123"

3. **Show Overview Tab:**
   - Total requests count
   - Active users count
   - Average resolution time
   - Status distribution chart
   - Category distribution chart

4. **Show Requests Tab:**
   - All requests from all users
   - Filter by status, category, priority
   - Select multiple requests (checkbox)
   - Show bulk operations
   - Assign technician to request

5. **Show Users Tab:**
   - List of all users
   - Role display
   - Request count per user
   - Active/Inactive status

---

### **Part 4: Technician Dashboard (2 min)**

1. **Logout** from admin account
2. **Login as Technician:**
   - Email: "mike.tech@campus.edu"
   - Password: "tech123"

3. **Show Technician Features:**
   - Assigned requests only
   - Statistics (Total, Pending, In Progress, Resolved)
   - Filter by status

4. **Update Request Status:**
   - Click "Update Status" on a request
   - Change status to "In Progress"
   - Add resolution notes: "Checking the projector connections"
   - Click "Update Request"

**Expected:** Status updated, request moves to "In Progress"

---

### **Part 5: Security & Features (1 min)**

1. **Show Security:**
   - Try accessing /admin without login → Redirects to login
   - Show JWT token in localStorage (DevTools)
   - Show password is hashed in database (MongoDB Compass)

2. **Show Responsive Design:**
   - Open DevTools (F12)
   - Toggle device toolbar
   - Show mobile view
   - Show tablet view
   - Show desktop view

---

## 🧪 FEATURE TESTING CHECKLIST

### Authentication
- [ ] Register new user (all roles)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Logout functionality
- [ ] Protected routes redirect to login
- [ ] Token stored in localStorage
- [ ] Token sent in API requests

### Student/Faculty Dashboard
- [ ] View statistics
- [ ] Create new request
- [ ] View request list
- [ ] Filter by status
- [ ] Filter by category
- [ ] View request details
- [ ] Delete pending request
- [ ] Cannot delete non-pending request

### Technician Dashboard
- [ ] View assigned requests only
- [ ] View statistics
- [ ] Filter by status
- [ ] Update request status
- [ ] Add resolution notes
- [ ] Cannot see unassigned requests

### Admin Dashboard
- [ ] View overview statistics
- [ ] View all requests
- [ ] Filter requests (status, category, priority)
- [ ] Select multiple requests
- [ ] Bulk update status
- [ ] Assign technician
- [ ] View all users
- [ ] User statistics

### Security
- [ ] Cannot access admin routes as student
- [ ] Cannot access technician routes as student
- [ ] Token expires after set time
- [ ] Rate limiting works (try 6+ login attempts)
- [ ] Input validation works
- [ ] XSS protection works

### UI/UX
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Loading states show
- [ ] Error messages display
- [ ] Success messages display
- [ ] Theme toggle works

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: Backend won't start
**Error:** `EADDRINUSE: address already in use :::8000`
**Solution:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
# Or change PORT in .env
```

### Issue 2: MongoDB connection failed
**Error:** `MongooseServerSelectionError`
**Solution:**
```bash
# Start MongoDB
brew services start mongodb-community
# Or
mongod --dbpath /path/to/data
```

### Issue 3: Frontend can't connect to backend
**Error:** `Network Error` or `CORS error`
**Solution:**
- Check backend is running on port 8000
- Check REACT_APP_API_URL in frontend/.env
- Check CORS configuration in backend/server.js

### Issue 4: Login not working
**Error:** `Invalid credentials`
**Solution:**
- Check if user exists in database
- Run seed script: `npm run seed`
- Check password is correct
- Check JWT_SECRET is set in .env

### Issue 5: Token expired
**Error:** `Invalid token`
**Solution:**
- Clear localStorage
- Login again
- Check JWT_EXPIRE in .env

---

## 📊 API TESTING (Using Postman/Thunder Client)

### 1. Register User
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@campus.edu",
  "password": "test123",
  "role": "student",
  "department": "Computer Science",
  "phone": "9876543210",
  "studentId": "CS2024100"
}
```

### 2. Login
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "test@campus.edu",
  "password": "test123"
}
```
**Response:** Copy the `token` from response

### 3. Get Profile (Protected)
```http
GET http://localhost:8000/api/auth/profile
Authorization: Bearer <your_token_here>
```

### 4. Create Request (Protected)
```http
POST http://localhost:8000/api/requests
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "title": "Test Request",
  "description": "This is a test request",
  "category": "it_support",
  "priority": "medium",
  "location": "Test Location"
}
```

### 5. Get My Requests (Protected)
```http
GET http://localhost:8000/api/requests/my-requests
Authorization: Bearer <your_token_here>
```

### 6. Admin Dashboard Stats (Admin Only)
```http
GET http://localhost:8000/api/admin/dashboard/stats
Authorization: Bearer <admin_token_here>
```

---

## 🎯 DEMO SCRIPT (Word-by-Word)

### Opening (30 seconds)
"Hello everyone. Today I'm presenting my Smart Campus Service Request System, a full-stack MEARN application that digitizes campus maintenance and support services. Let me show you how it works."

### Landing Page (30 seconds)
"When you first visit the application, you see this professional landing page. It has a hero section explaining what the system does, a features overview, how it works in 3 simple steps, and role explanations. Users can either login or register from here."

### Registration (45 seconds)
"Let me register as a student. I'll enter my name, email, password, select the student role, provide my department, phone number, and student ID. The system validates all inputs in real-time. After registration, I'm automatically logged in and redirected to my dashboard."

### Student Dashboard (60 seconds)
"This is the student dashboard. At the top, I see statistics - total requests, pending, in progress, and resolved. I can create a new request by clicking here. Let me create one - I'll report a projector issue in the computer lab. I provide a title, description, select IT Support category, set priority to high, and specify the location. After submitting, the request appears in my list with a unique ID and pending status."

### Admin Dashboard (90 seconds)
"Now let me login as an admin. The admin dashboard is more comprehensive. In the overview tab, I see total requests, active users, average resolution time, and distribution charts. In the requests tab, I can see all requests from all users, filter by status, category, or priority. I can select multiple requests and perform bulk operations like assigning them to technicians. The users tab shows all registered users with their roles and activity."

### Technician Dashboard (45 seconds)
"Finally, the technician dashboard. Technicians only see requests assigned to them. They can update the status from pending to in progress to resolved, and add resolution notes. This ensures accountability and tracking."

### Security (30 seconds)
"The system is highly secure. I use JWT authentication, password hashing with bcrypt, rate limiting to prevent brute force attacks, input validation, and role-based access control. If I try to access admin routes as a student, I'm denied access."

### Closing (20 seconds)
"The application is fully responsive, works on all devices, and follows industry best practices. Thank you for your attention. I'm happy to answer any questions."

---

## 📸 SCREENSHOTS TO TAKE

1. Landing Page
2. Registration Page
3. Login Page
4. Student Dashboard
5. Create Request Form
6. Request Details
7. Admin Dashboard - Overview
8. Admin Dashboard - Requests
9. Admin Dashboard - Users
10. Technician Dashboard
11. Mobile View
12. Database Schema (MongoDB Compass)

---

## ✅ FINAL PRE-DEMO CHECKLIST

**30 Minutes Before:**
- [ ] Backend server running
- [ ] Frontend app running
- [ ] MongoDB connected
- [ ] Sample data loaded
- [ ] Browser cache cleared
- [ ] DevTools ready (F12)
- [ ] Postman/Thunder Client ready (optional)
- [ ] MongoDB Compass open (optional)
- [ ] All features tested once
- [ ] Internet connection stable

**5 Minutes Before:**
- [ ] Close unnecessary tabs
- [ ] Close unnecessary applications
- [ ] Full screen browser
- [ ] Zoom level 100%
- [ ] Volume checked (if presenting online)
- [ ] Screen sharing tested (if presenting online)

**During Demo:**
- [ ] Speak clearly and confidently
- [ ] Explain what you're doing
- [ ] Show features systematically
- [ ] Handle errors gracefully
- [ ] Answer questions confidently

---

## 🎓 CONFIDENCE TIPS

1. **Practice the demo 3-5 times** before the actual presentation
2. **Know your code** - be ready to explain any file
3. **Prepare for "What if" questions** - think about edge cases
4. **Stay calm** - if something breaks, explain what should happen
5. **Be honest** - if you don't know something, say you'll research it
6. **Show enthusiasm** - you built something amazing!

---

**Remember: You've built a production-ready application. Be proud and confident! 💪**