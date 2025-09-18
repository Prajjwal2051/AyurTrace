#!/bin/bash

# AyurTrace Project Launcher
echo "🚀 Launching AyurTrace Project..."
echo "=================================="

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down AyurTrace..."
    pkill -f "npm start"
    pkill -f "react-scripts"
    pkill -f "node src/server.js"
    exit 0
}

# Set up trap to cleanup on Ctrl+C
trap cleanup SIGINT

# Navigate to project root
cd "$(dirname "$0")"

# Start backend server
echo "📡 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend server
echo "🖥️  Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Display information
echo ""
echo "✅ AyurTrace is now running!"
echo "=================================="
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend:  http://localhost:3001"
echo "🏥 Health:   http://localhost:3001/api/health"
echo ""
echo "📋 Demo Login Credentials:"
echo "  👨‍🌾 Farmer:       farmer@example.com / farmer123"
echo "  👤 Consumer:     consumer@example.com / consumer123"  
echo "  🏭 Manufacturer: manufacturer@example.com / manufacturer123"
echo "  👨‍💼 Admin:        admin@example.com / admin123"
echo ""
echo "📦 Available Batch IDs for testing:"
echo "  • BATCH-F-2024-012 (Ashwagandha)"
echo "  • BATCH-F-2024-013 (Tulsi)"
echo "  • BATCH-F-2024-014 (Brahmi)"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "=================================="

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
