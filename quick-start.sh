#!/bin/bash

# Quick Start - No dependency check, faster startup
echo "🚀 AyurTrace Quick Start"
echo "======================="

cd backend && npm run dev &
BACKEND_PID=$!

cd ../frontend && BROWSER=none npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Started in quick mode!"
echo "🌐 Frontend: http://localhost:3000" 
echo "⚡ Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop"

trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' SIGINT
wait
