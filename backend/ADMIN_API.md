# Admin Management API Testing Guide

## Base URL: http://localhost:3001

**Note: All endpoints require admin authentication. Include admin JWT token in Authorization header.**

## 1. Dashboard Statistics
**GET** `/api/admin/dashboard/stats?period=30`

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Query Parameters:**
- `period` (optional): Number of days for analytics (default: 30)

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "overview": {
      "totalRequests": 150,
      "totalUsers": 45,
      "avgResolutionTime": 2.5
    },
    "statusDistribution": [
      { "_id": "pending", "count": 25 },
      { "_id": "in_progress", "count": 15 },
      { "_id": "resolved", "count": 80 },
      { "_id": "closed", "count": 30 }
    ],
    "categoryDistribution": [
      { "_id": "maintenance", "count": 60 },
      { "_id": "it_support", "count": 40 },
      { "_id": "facilities", "count": 30 },
      { "_id": "security", "count": 20 }
    ],
    "priorityDistribution": [
      { "_id": "low", "count": 40 },
      { "_id": "medium", "count": 70 },
      { "_id": "high", "count": 30 },
      { "_id": "urgent", "count": 10 }
    ],
    "requestsTrend": [
      { "_id": "2024-01-01", "count": 5 },
      { "_id": "2024-01-02", "count": 8 }
    ]
  }
}
```

## 2. Advanced Filtered Requests
**GET** `/api/admin/requests/filtered`

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Query Parameters:**
- `status`: pending, in_progress, resolved, closed
- `category`: maintenance, it_support, facilities, security, other
- `priority`: low, medium, high, urgent
- `assignedTo`: Filter by assigned person (partial match)
- `dateFrom`: Start date (ISO format: 2024-01-01)
- `dateTo`: End date (ISO format: 2024-01-31)
- `department`: Filter by user department
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: asc or desc (default: desc)

**Example:**
```
GET /api/admin/requests/filtered?status=pending&category=maintenance&priority=high&page=1&limit=5&sortBy=createdAt&sortOrder=desc
```

## 3. Bulk Update Requests
**PUT** `/api/admin/requests/bulk-update`

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "requestIds": [
    "request_id_1",
    "request_id_2",
    "request_id_3"
  ],
  "updates": {
    "status": "in_progress",
    "priority": "high",
    "assignedTo": "John Smith - Maintenance Team",
    "adminRemarks": "Assigned to maintenance team for immediate attention"
  }
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "3 requests updated successfully",
  "data": {
    "matchedCount": 3,
    "modifiedCount": 3
  }
}
```

## 4. User Management
**GET** `/api/admin/users?role=student&department=Computer&page=1&limit=10`

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Query Parameters:**
- `role`: student, faculty, admin
- `department`: Filter by department (partial match)
- `isActive`: true or false
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "department": "Computer Science",
        "phone": "1234567890",
        "isActive": true,
        "requestCount": 5,
        "createdAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "total": 5,
      "count": 10,
      "totalUsers": 45
    }
  }
}
```

## 5. Toggle User Status
**PUT** `/api/admin/users/:userId/toggle-status`

**Headers:**
```
Authorization: Bearer admin_jwt_token_here
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": false
    }
  }
}
```

## Sample Test Scenarios

### 1. Get Dashboard Stats for Last 7 Days
```
GET /api/admin/dashboard/stats?period=7
```

### 2. Get High Priority Pending Requests
```
GET /api/admin/requests/filtered?status=pending&priority=high&sortBy=createdAt&sortOrder=desc
```

### 3. Bulk Assign Maintenance Requests
```json
{
  "requestIds": ["req1", "req2", "req3"],
  "updates": {
    "status": "in_progress",
    "assignedTo": "Maintenance Team A",
    "adminRemarks": "Assigned to Team A for resolution"
  }
}
```

### 4. Get All Students from CS Department
```
GET /api/admin/users?role=student&department=Computer Science&isActive=true
```

## Analytics Use Cases

1. **Performance Monitoring**: Track resolution times and request volumes
2. **Resource Planning**: Analyze category and priority distributions
3. **User Activity**: Monitor user engagement and request patterns
4. **Trend Analysis**: Identify peak request periods and seasonal patterns

## Error Responses
- **400**: Validation errors, invalid parameters
- **401**: Authentication required
- **403**: Admin access required
- **404**: Resource not found
- **500**: Server error