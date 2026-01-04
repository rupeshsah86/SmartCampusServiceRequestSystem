# Service Request API Testing Guide

## Base URL: http://localhost:3001

**Note: All endpoints require authentication. Include JWT token in Authorization header.**

## 1. Create Service Request
**POST** `/api/requests`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Broken AC in Room 101",
  "description": "The air conditioning unit in classroom 101 is not working properly. It's making loud noises and not cooling effectively.",
  "category": "maintenance",
  "priority": "high",
  "location": "Room 101, Building A"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Service request created successfully",
  "data": {
    "requestId": "REQ1703123456789",
    "userId": "user_id",
    "title": "Broken AC in Room 101",
    "status": "pending",
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
}
```

## 2. Get User's Requests
**GET** `/api/requests/my-requests?status=pending&page=1&limit=10`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `status` (optional): pending, in_progress, resolved, closed
- `category` (optional): maintenance, it_support, facilities, security, other
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

## 3. Get All Requests (Admin Only)
**GET** `/api/requests?status=pending&category=maintenance&page=1&limit=10`

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Query Parameters:**
- `status`, `category`, `priority`, `page`, `limit`, `search`

## 4. Get Single Request
**GET** `/api/requests/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

## 5. Update Request Status (Admin Only)
**PUT** `/api/requests/:id/status`

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "in_progress",
  "adminRemarks": "Assigned to maintenance team",
  "assignedTo": "John Smith - Maintenance"
}
```

**Status Flow:**
- pending → in_progress, closed
- in_progress → resolved, pending
- resolved → closed, in_progress
- closed → (no transitions allowed)

## 6. Delete Request
**DELETE** `/api/requests/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Note:** Only pending requests can be deleted, and only by creator or admin.

## Sample Test Data

### Student Request:
```json
{
  "title": "WiFi connectivity issues in Library",
  "description": "Unable to connect to campus WiFi in the main library. Connection keeps dropping every few minutes.",
  "category": "it_support",
  "priority": "medium",
  "location": "Main Library, 2nd Floor"
}
```

### Faculty Request:
```json
{
  "title": "Projector not working in Conference Room",
  "description": "The projector in conference room B is not displaying properly. Screen appears dim and colors are distorted.",
  "category": "facilities",
  "priority": "urgent",
  "location": "Conference Room B, Admin Building"
}
```

## Error Responses
- **400**: Validation errors, invalid status transitions
- **401**: Authentication required
- **403**: Access denied (insufficient permissions)
- **404**: Request not found
- **500**: Server error