#!/bin/bash

echo "🔍 Testing Smart Campus Backend..."
echo ""

# Test 1: Check if backend is running
echo "1️⃣ Testing backend connection..."
curl -s http://localhost:8000/ | grep -q "Smart Campus" && echo "✅ Backend is running" || echo "❌ Backend is NOT running"
echo ""

# Test 2: Test registration
echo "2️⃣ Testing registration..."
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@campus.edu",
    "password": "test123",
    "role": "student",
    "department": "Computer Science",
    "phone": "9876543210",
    "studentId": "CS2024999"
  }' \
  -w "\nStatus: %{http_code}\n"
echo ""

# Test 3: Test login
echo "3️⃣ Testing login..."
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@campus.edu",
    "password": "test123"
  }' \
  -w "\nStatus: %{http_code}\n"
echo ""

echo "✅ Tests complete!"