#!/bin/bash

# Stop all AyurTrace processes
echo "🛑 Stopping AyurTrace servers..."

# Kill backend processes
pkill -f "server.js" 2>/dev/null
pkill -f "nodemon.*server.js" 2>/dev/null

# Kill frontend processes  
pkill -f "react-scripts" 2>/dev/null

# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

echo "✅ All AyurTrace servers stopped"
echo "🧹 Ports 3000 and 3001 are now free"
