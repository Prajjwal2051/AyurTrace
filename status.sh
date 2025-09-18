#!/bin/bash

# AyurTrace Status Manager
echo "🔍 AyurTrace Project Status"
echo "========================="

# Check if backend is running
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend: Running on http://localhost:3001"
    BACKEND_STATUS=$(curl -s http://localhost:3001/api/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    echo "   Status: $BACKEND_STATUS"
else
    echo "❌ Backend: Not running"
fi

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Running on http://localhost:3000"
else
    echo "❌ Frontend: Not running"
fi

echo ""
echo "🖥️  Quick Actions:"
echo "  • Open App: xdg-open http://localhost:3000"
echo "  • View Backend Logs: tail -f /home/prajjwal25/Desktop/Coding/AyurTrace/AyurTrace/backend/backend.log"
echo "  • View Frontend Logs: tail -f /home/prajjwal25/Desktop/Coding/AyurTrace/AyurTrace/frontend/frontend.log"
echo "  • Stop All: pkill -f 'npm start'"

echo ""
echo "📋 Demo Credentials:"
echo "  👨‍🌾 Farmer: farmer@example.com / farmer123"
echo "  👤 Consumer: consumer@example.com / consumer123"
echo "  🏭 Manufacturer: manufacturer@example.com / manufacturer123"
echo "  👨‍💼 Admin: admin@example.com / admin123"

echo ""
echo "📦 Test Batch IDs:"
echo "  • BATCH-F-2024-012 (Ashwagandha)"
echo "  • BATCH-F-2024-013 (Tulsi)"
echo "  • BATCH-F-2024-014 (Brahmi)"

echo ""
echo "⚙️  Process Information:"
ps aux | grep -E "(npm start|react-scripts|node.*server)" | grep -v grep | while read line; do
    echo "  $line"
done
