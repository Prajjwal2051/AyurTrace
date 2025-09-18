#!/bin/bash

# AyurTrace Startup Script
# This script starts both backend and frontend servers

echo "🌿 Starting AyurTrace - Blockchain Herb Traceability Platform"
echo "============================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# Function to start servers
start_servers() {
    echo -e "${YELLOW}🚀 Starting servers...${NC}"
    
    # Start backend in background
    echo -e "${BLUE}Starting backend server on port 3001...${NC}"
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a bit for backend to start
    sleep 3
    
    # Start frontend in background
    echo -e "${BLUE}Starting frontend server on port 3000...${NC}"
    cd frontend  
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for servers to start
    echo -e "${YELLOW}⏳ Waiting for servers to start...${NC}"
    sleep 5
    
    # Check if servers are running
    if kill -0 $BACKEND_PID 2>/dev/null && kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${GREEN}✅ Both servers started successfully!${NC}"
        echo ""
        echo "🌐 Access your application:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:3001"
        echo "   API Health: http://localhost:3001/api/health"
        echo ""
        echo "Press Ctrl+C to stop both servers"
        echo ""
        
        # Keep script running and handle Ctrl+C
        trap 'echo -e "\n${YELLOW}🛑 Stopping servers...${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' SIGINT
        wait
    else
        echo -e "${RED}❌ Failed to start servers${NC}"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
        exit 1
    fi
}

# Main execution
main() {
    check_node
    
    # Check if node_modules exist
    if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
        install_deps
    else
        echo -e "${GREEN}✅ Dependencies already installed${NC}"
    fi
    
    start_servers
}

# Run main function
main
