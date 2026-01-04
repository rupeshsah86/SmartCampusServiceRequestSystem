# Authentication API Testing Guide

## Base URL: http://localhost:3001

## 1. User Registration
**POST** `/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "department": "Computer Science",
  "phone": "1234567890",
  "studentId": "CS2024001"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science"
    },
    "token": "jwt_token_here"
  }
}
```

## 2. User Login
**POST** `/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science"
    },
    "token": "jwt_token_here"
  }
}
```

## 3. Get User Profile (Protected)
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science",
      "phone": "1234567890",
      "studentId": "CS2024001"
    }
  }
}
```

## Admin User Registration
For admin user, use:
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

## Error Responses
- **400**: Validation errors
- **401**: Invalid credentials or token
- **403**: Insufficient permissions
- **500**: Server error