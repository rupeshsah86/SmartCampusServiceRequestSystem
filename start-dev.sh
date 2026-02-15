#!/bin/bash

# Smart Campus System - Development Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting Smart Campus System..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "  brew services start mongodb-community"
    echo "  OR"
    echo "  mongod --config /usr/local/etc/mongod.conf"
    exit 1
fi

echo "✅ MongoDB is running"
echo ""

# Start Backend Server
echo "📦 Starting Backend Server (Port 8000)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend Server
echo "🎨 Starting Frontend Server (Port 3000)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting..."
echo ""
echo "📍 Backend:  http://localhost:8000"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
