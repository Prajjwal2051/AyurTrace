#!/bin/bash

# AyurTrace Professional Startup Script
# Enhanced version with better error handling and features

echo "" 
echo "🌿 AyurTrace - Professional Startup Script"
echo "===========================================" 
echo "🌱 Blockchain-Powered Herb Traceability Platform"
echo "✨ Enhanced with Modern UI & Professional Design"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if ports are available
check_ports() {
    echo -e "${BLUE}Checking if ports 3000 and 3001 are available...${NC}"
    
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port 3000 is already in use${NC}"
        echo -e "${BLUE}Attempting to free port 3000...${NC}"
        pkill -f "react-scripts" 2>/dev/null || true
        sleep 2
    fi
    
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port 3001 is already in use${NC}"
        echo -e "${BLUE}Attempting to free port 3001...${NC}"
        pkill -f "server.js" 2>/dev/null || true
        sleep 2
    fi
    
    echo -e "${GREEN}✓ Ports are ready${NC}"
}

# Function to check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js >= 16.0.0${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        echo -e "${RED}❌ Node.js version is too old. Please upgrade to >= 16.0.0${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js $(node --version) is installed${NC}"
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    
    # Backend dependencies
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    cd backend
    npm install --silent
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
    cd ..
    
    # Frontend dependencies  
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    cd frontend
    npm install --silent
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
    cd ..
    
    echo -e "${GREEN}✅ All dependencies installed${NC}"
}

# Function to check server health
check_health() {
    local url=$1
    local timeout=${2:-30}
    local count=0
    
    while [ $count -lt $timeout ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            return 0
        fi
        count=$((count + 1))
        sleep 1
    done
    return 1
}

# Function to start servers
start_servers() {
    echo -e "${YELLOW}🚀 Starting servers...${NC}"
    
    # Start backend in background
    echo -e "${BLUE}Starting backend server on port 3001...${NC}"
    cd backend
    npm run dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait and check backend health
    echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
    if check_health "http://localhost:3001/api/health" 30; then
        echo -e "${GREEN}✓ Backend server is healthy${NC}"
    else
        echo -e "${RED}❌ Backend failed to start properly${NC}"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    # Start frontend in background
    echo -e "${BLUE}Starting frontend server on port 3000...${NC}"
    cd frontend  
    BROWSER=none npm start > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    # Wait and check frontend
    echo -e "${YELLOW}⏳ Waiting for frontend to be ready...${NC}"
    if check_health "http://localhost:3000" 45; then
        echo -e "${GREEN}✓ Frontend server is healthy${NC}"
    else
        echo -e "${RED}❌ Frontend failed to start properly${NC}"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
        exit 1
    fi
}

# Function to setup environment
setup_env() {
    # Create logs directory
    mkdir -p logs
    
    # Clear old logs
    > logs/backend.log
    > logs/frontend.log
    
    echo -e "${GREEN}✓ Environment prepared${NC}"
}

# Function to show success message with features
show_success() {
    echo -e "${GREEN}✓✓✓ AyurTrace Successfully Started! ✓✓✓${NC}"
    echo ""
    echo -e "${BLUE}🌐 Access your application:${NC}"
    echo -e "   🏠 Frontend:    ${GREEN}http://localhost:3000${NC}"
    echo -e "   ⚙️  Backend API:  ${GREEN}http://localhost:3001${NC}"
    echo -e "   💊 Health Check: ${GREEN}http://localhost:3001/api/health${NC}"
    echo ""
    echo -e "${YELLOW}✨ New Features Available:${NC}"
    echo -e "   🎨 Professional Color Palette"
    echo -e "   📊 Live Statistics Dashboard"
    echo -e "   ✨ Interactive Animations & Sparkle Effects"
    echo -e "   📄 Advanced Data Export Manager"
    echo -e "   📱 Enhanced QR Scanner with Camera Preview"
    echo -e "   ⛓️  Blockchain Transaction Viewer"
    echo ""
    echo -e "${GREEN}📝 Logs available in:${NC}"
    echo -e "   Backend:  logs/backend.log"
    echo -e "   Frontend: logs/frontend.log"
    echo ""
    echo -e "${RED}🛑 Press Ctrl+C to stop all servers${NC}"
    echo ""
}

# Main execution
main() {
    check_node
    check_ports
    setup_env
    
    # Check if node_modules exist
    if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
        install_deps
    else
        echo -e "${GREEN}✓ Dependencies already installed${NC}"
    fi
    
    start_servers
    show_success
    
    # Keep script running and handle Ctrl+C
    trap 'echo -e "\n${YELLOW}🛑 Stopping AyurTrace servers...${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo -e "${GREEN}✓ Servers stopped successfully${NC}"; exit 0' SIGINT
    wait
}

# Run main function
main
