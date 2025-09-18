# AyurTrace - Quick Start Guide

## 🎉 Project is Now Running!

Your AyurTrace blockchain supply chain traceability system is successfully up and running in demo mode.

## 🌐 Access URLs

### Frontend Application
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Status**: ✅ Running
- **Description**: React.js frontend with beautiful UI showing project overview and features

### Backend API
- **URL**: [http://localhost:3001](http://localhost:3001)
- **Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)  
- **API Documentation**: [http://localhost:3001/api](http://localhost:3001/api)
- **Status**: ✅ Running in Demo Mode (without MongoDB)

## 🚀 What's Working

### ✅ Current Features
- [x] Backend API Server (Express.js + Node.js)
- [x] Frontend React Application  
- [x] Health monitoring endpoints
- [x] Mock data for demo purposes
- [x] API route structure for all portals
- [x] Security middleware (CORS, Helmet, Rate Limiting)
- [x] Beautiful responsive UI design
- [x] Bootstrap + Font Awesome integration

### 📋 API Endpoints Available
- `GET /api/health` - Health check
- `GET /api` - API documentation
- `POST /api/auth/register` - User registration (mock)
- `POST /api/auth/login` - User login (mock)
- `GET /api/farmer/*` - Farmer portal endpoints (mock)
- `GET /api/manufacturer/*` - Manufacturer endpoints (mock)
- `GET /api/consumer/*` - Consumer endpoints (mock)
- `GET /api/blockchain/*` - Blockchain endpoints (mock)
- `GET /api/dashboard/*` - Dashboard endpoints (mock)
- `GET /api/admin/*` - Admin endpoints (mock)

## 🛠️ Technology Stack

### Backend
- **Framework**: Node.js + Express.js
- **Security**: Helmet, CORS, Rate Limiting, JWT
- **Logging**: Winston
- **Environment**: Development mode

### Frontend  
- **Framework**: React 18
- **UI**: Bootstrap 5 + Font Awesome
- **Responsive**: Mobile-first design
- **Styling**: Custom CSS with animations

## 📊 Current Status

### Running Processes
```bash
# Backend Server
Process: node src/server.js
Port: 3001
Status: Running ✅

# Frontend Development Server  
Process: npm start
Port: 3000
Status: Running ✅
```

### Demo Mode Features
- ✅ Mock user authentication
- ✅ Simulated blockchain operations
- ✅ Sample herb batch data
- ✅ Dummy QR code generation
- ✅ Fake GPS coordinates
- ✅ Test quality metrics

## 🔧 Next Development Steps

To continue developing the full system, you can:

1. **Install MongoDB** for real database operations
2. **Set up Hyperledger Fabric** network for blockchain
3. **Implement full authentication** system
4. **Add real QR code generation** 
5. **Integrate GPS tracking** capabilities
6. **Build complete UI components** for all portals
7. **Add file upload** functionality
8. **Implement email notifications**

## 🎯 How to Test

1. **Visit Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser
2. **Test API**: Use curl or Postman to test [http://localhost:3001/api/health](http://localhost:3001/api/health)
3. **Browse Features**: Navigate through the beautiful landing page
4. **Check API Documentation**: Visit [http://localhost:3001/api](http://localhost:3001/api)

## 🔄 Stopping the Servers

To stop the running servers:

```bash
# Kill all background jobs
kill %1 %2

# Or stop individual processes
jobs  # See running jobs
kill %1  # Backend
kill %2  # Frontend
```

## 📝 Notes

- Project is running in **demo/development mode**
- All data is **mock/simulated** 
- Database shows as "disconnected" (expected)
- No blockchain network is active yet
- All authentication is **simulated**

Your AyurTrace project foundation is ready! 🌿✨
