# Thunder Client CRUD Testing - Step by Step

## Start Server First
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:8000`

---

## 1. REGISTER STUDENT
**POST** `http://localhost:8000/api/auth/register`
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "name": "John Student",
  "email": "john@campus.edu",
  "password": "password123",
  "role": "student",
  "department": "Computer Science",
  "phone": "1234567890",
  "studentId": "CS001"
}
```
**Copy JWT token from response**

---

## 2. REGISTER ADMIN
**POST** `http://localhost:8000/api/auth/register`
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@campus.edu",
  "password": "admin123",
  "role": "admin",
  "department": "Administration",
  "phone": "9876543210",
  "employeeId": "EMP001"
}
```
**Copy Admin JWT token from response**

---

## 3. LOGIN STUDENT
**POST** `http://localhost:8000/api/auth/login`
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "email": "john@campus.edu",
  "password": "password123"
}
```

---

## 4. GET PROFILE (Protected)
**GET** `http://localhost:8000/api/auth/profile`
**Headers:**
```
Authorization: Bearer STUDENT_JWT_TOKEN_HERE
```

---

## 5. CREATE REQUEST
**POST** `http://localhost:8000/api/requests`
**Headers:**
```
Authorization: Bearer STUDENT_JWT_TOKEN_HERE
Content-Type: application/json
```
**Body:**
```json
{
  "title": "Broken AC in Room 101",
  "description": "AC not working properly",
  "category": "maintenance",
  "priority": "high",
  "location": "Room 101, Building A"
}
```
**Copy request ID from response**

---

## 6. GET MY REQUESTS
**GET** `http://localhost:8000/api/requests/my-requests`
**Headers:**
```
Authorization: Bearer STUDENT_JWT_TOKEN_HERE
```

---

## 7. GET SINGLE REQUEST
**GET** `http://localhost:8000/api/requests/REQUEST_ID_HERE`
**Headers:**
```
Authorization: Bearer STUDENT_JWT_TOKEN_HERE
```
**Replace REQUEST_ID_HERE with actual ID**

---

## 8. GET ALL REQUESTS (Admin)
**GET** `http://localhost:8000/api/requests`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN_HERE
```

---

## 9. UPDATE REQUEST STATUS (Admin)
**PUT** `http://localhost:8000/api/requests/REQUEST_ID_HERE/status`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN_HERE
Content-Type: application/json
```
**Body:**
```json
{
  "status": "in_progress",
  "adminRemarks": "Assigned to maintenance",
  "assignedTo": "John Smith"
}
```

---

## 10. DASHBOARD STATS (Admin)
**GET** `http://localhost:8000/api/admin/dashboard/stats`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN_HERE
```

---

## 11. FILTERED REQUESTS (Admin)
**GET** `http://localhost:8000/api/admin/requests/filtered?status=pending`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN_HERE
```

---

## 12. USER MANAGEMENT (Admin)
**GET** `http://localhost:8000/api/admin/users`
**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN_HERE
```

---

## 13. DELETE REQUEST
**DELETE** `http://localhost:8000/api/requests/REQUEST_ID_HERE`
**Headers:**
```
Authorization: Bearer STUDENT_JWT_TOKEN_HERE
```
**Only works for pending requests**

---

## Test Order:
1. Register Student & Admin
2. Login to get tokens
3. Create requests
4. Test all GET operations
5. Test UPDATE operations (admin)
6. Test DELETE operations

## Expected Status Codes:
- 201: Created successfully
- 200: Success
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (not admin)
- 404: Not found