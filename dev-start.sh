#!/bin/bash

# AyurTrace Development Startup Script
echo "🚀 Starting AyurTrace in Development Mode"
echo "=========================================="

# Function to clean up background processes
cleanup() {
    echo ""
    echo "🛑 Stopping AyurTrace services..."
    if [[ -n $BACKEND_PID ]]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend stopped"
    fi
    if [[ -n $FRONTEND_PID ]]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend stopped"
    fi
    exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup SIGINT SIGTERM

# Kill any existing processes on the ports
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "⚛️  Starting frontend server..."
cd ../frontend
BROWSER=none npm start &
FRONTEND_PID=$!

# Wait for services to start
sleep 5

echo ""
echo "✅ AyurTrace Development Environment Ready!"
echo "🌐 Frontend: http://localhost:3000"
echo "⚡ Backend:  http://localhost:3001"
echo "💊 Health:   http://localhost:3001/api/health"
echo ""
echo "📋 Demo Credentials:"
echo "   Farmer:       ramesh.farmer@ayurtrace.com / Farmer123!"
echo "   Manufacturer: arvind.manufacturer@ayurtrace.com / Manufacturer123!"
echo "   Consumer:     priya.consumer@ayurtrace.com / Consumer123!"
echo "   Admin:        admin@ayurtrace.com / Admin123!"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait