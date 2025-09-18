# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AyurTrace is a blockchain-based supply chain traceability system for Ayurvedic herbs, addressing the ₹5,000+ crore annual losses from counterfeit Ayurvedic products in India. Built for Smart India Hackathon 2025.

**Architecture**: Full-stack application with Hyperledger Fabric blockchain, Node.js/Express backend, React frontend, and MongoDB database.

## Core Technology Stack

- **Blockchain**: Hyperledger Fabric with custom chaincode (`blockchain/chaincodes/ayurtrace.js`)
- **Backend**: Node.js with Express.js, JWT authentication, role-based access control
- **Frontend**: React 18 with Bootstrap 5, responsive design
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, input sanitization
- **Deployment**: Docker Compose with microservices architecture

## Development Commands

### Quick Start (Development Mode)
```bash
# Start both frontend and backend in development mode
./quick-start.sh

# Or launch with full setup and demo credentials
./launch.sh
```

### Backend Development
```bash
cd backend

# Development with auto-reload
npm run dev

# Production start
npm start

# Run tests with coverage
npm test
npm run test:coverage

# Lint and fix code
npm run lint
npm run lint:fix

# Seed database with sample data
npm run seed
```

### Frontend Development
```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format

# Bundle analysis
npm run analyze
```

### Blockchain Operations
```bash
cd blockchain

# Set up complete Hyperledger Fabric network
./scripts/setup-network.sh

# Clean and reset network
./scripts/setup-network.sh clean

# Deploy chaincode updates (after network is running)
./scripts/deploy-chaincode.sh
```

### Docker Operations
```bash
# Start entire system with all services
docker-compose up -d

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Stop all services
docker-compose down

# Stop with volume cleanup
docker-compose down -v

# Build specific service
docker-compose build backend
```

### Testing
```bash
# Backend tests (Jest)
cd backend && npm test

# Frontend tests (React Testing Library)
cd frontend && npm test

# Run specific test file
npm test -- test-blockchain-ledger.js

# Integration tests (requires running services)
npm run test:integration
```

## High-Level Architecture

### Blockchain Layer (Hyperledger Fabric)
- **Smart Contract**: `blockchain/chaincodes/ayurtrace.js` - Core business logic for herb batch lifecycle
- **Network Config**: Single organization (Org1) with peer, orderer, and CA
- **Channel**: `ayurchannel` for all herb transactions
- **Key Functions**: `createHerbBatch`, `processHerb`, `updateQuality`, `transferOwnership`, `generateQR`

### Backend API Architecture (`backend/src/`)
- **Entry Point**: `server.js` - Express app with security middleware, error handling
- **Routes Structure**:
  - `/api/auth` - JWT authentication, role-based access
  - `/api/farmer` - Herb batch creation, farm management
  - `/api/manufacturer` - Processing workflows, quality control
  - `/api/consumer` - Product verification, supply chain journey
  - `/api/blockchain` - Direct blockchain queries, transaction history
  - `/api/dashboard` - Analytics and real-time metrics
  - `/api/admin` - System administration, user management
- **Models**: MongoDB schemas in `models/` for Users, HerbBatches with full lifecycle tracking
- **Security**: Rate limiting, CORS, helmet, input sanitization, XSS protection

### Frontend Architecture (`frontend/src/`)
- **Routing**: React Router with role-based protected routes
- **Authentication**: Context-based auth state management with JWT tokens
- **Portal System**: Separate dashboards for Farmer, Manufacturer, Consumer, Admin roles
- **Components**: Reusable UI components in `components/` directory
- **API Integration**: Axios-based API services with error handling
- **Styling**: Bootstrap 5 with custom CSS, responsive mobile-first design

### Data Flow Pattern
1. **Farmers**: Create herb batches with GPS coordinates, quality grades (A/B/C)
2. **Blockchain**: Immutable recording via `createHerbBatch` chaincode function
3. **Manufacturers**: Process herbs, add lab results, generate QR codes
4. **Consumers**: Scan QR codes for instant blockchain verification
5. **Analytics**: Real-time dashboard metrics from MongoDB and blockchain events

### Role-Based Access Control
- **Farmers**: Batch creation, harvest tracking, farm management
- **Manufacturers**: Processing workflows, quality testing, product creation
- **Consumers**: Product verification, supply chain transparency
- **Admins**: System management, user oversight, analytics
- **Gov Admins**: Ministry of AYUSH compliance, regulatory oversight

## Key Business Logic

### Herb Lifecycle Management
- **Seasonal Validation**: Chaincode validates harvest timing for each herb type
- **Quality Grading**: A/B/C system with lab test integration
- **Processing Steps**: Drying, grinding, extraction with timestamp tracking
- **Ownership Transfers**: Immutable custody chain from farm to consumer
- **QR Generation**: Unique codes linking to blockchain verification URLs

### Supply Chain Transparency
- **GPS Tracking**: Automatic coordinate capture for harvest locations
- **Interactive Maps**: Visual journey from farm to consumer
- **Farmer Profiles**: Stories and photos for consumer connection
- **Real-time Updates**: WebSocket integration for live status changes

## Environment Configuration

### Required Environment Variables (`backend/.env`)
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ayurtrace
JWT_SECRET=your-super-secret-jwt-key
FABRIC_NETWORK_PATH=../blockchain/network
CHAINCODE_NAME=ayurtrace
CHANNEL_NAME=ayurchannel
```

### Demo Credentials (Development)
- **Farmer**: ramesh.farmer@ayurtrace.com / Farmer123!
- **Manufacturer**: arvind.manufacturer@ayurtrace.com / Manufacturer123!
- **Consumer**: priya.consumer@ayurtrace.com / Consumer123!
- **Admin**: admin@ayurtrace.com / Admin123!

## Database Operations

### Seeding Sample Data
```bash
cd scripts
node seed-database.js  # Creates users, herb batches, and blockchain entries
```

### MongoDB Collections
- **users**: Role-based user accounts with farm/company details
- **herbbatches**: Complete herb lifecycle with blockchain integration
- **Indexes**: Geographic indexing for location queries, text search on herb types

## Monitoring and Health

### Health Checks
- Backend API: `http://localhost:3001/api/health`
- Frontend: `http://localhost:3000`
- Blockchain Explorer: `http://localhost:8080` (when running)
- Monitoring Dashboard: `http://localhost:3030` (Grafana)

### Logging
- Application logs: `backend/logs/combined.log`
- Error logs: `backend/logs/error.log`
- Winston logger with structured JSON format
- Docker logs: `docker-compose logs -f [service]`

## Security Considerations

### Production Deployment
- Change all default secrets in `.env` files
- Enable TLS for Hyperledger Fabric network
- Configure proper CORS origins for production domains
- Set up rate limiting based on production traffic
- Enable MongoDB authentication and encryption

### API Security
- JWT tokens with 7-day expiration
- Rate limiting: 200 requests per 15-minute window
- Input sanitization against NoSQL injection and XSS
- Role-based endpoint protection with middleware
- File upload restrictions and validation

## Troubleshooting

### Common Issues
- **MongoDB Connection Failed**: System runs in demo mode with mock data
- **Blockchain Network Down**: API returns simulated blockchain responses
- **Docker Permission Issues**: Ensure Docker daemon is running and user has permissions
- **Port Conflicts**: Check if ports 3000, 3001, 7050, 7051, 27017 are available

### Development Workflow
1. Always run `./quick-start.sh` for rapid development setup
2. Use `docker-compose logs -f [service]` for debugging container issues
3. Frontend proxy configured to backend at `http://localhost:3001`
4. Hot reloading enabled for both frontend and backend in development
5. Database changes require running `npm run seed` to reset sample data

## Blockchain Integration Points

### Smart Contract Functions
- All herb operations go through chaincode for immutable recording
- Event emission for real-time updates via WebSocket
- Historical data querying with `getHerbHistory`
- Quality test results permanently stored on-chain
- QR code generation creates tamper-proof verification links

### API-Blockchain Bridge
- Backend routes translate REST calls to Fabric SDK operations
- Async operations with proper error handling for blockchain timeouts
- Caching layer via Redis for frequently accessed blockchain data
- Offline mode capability when blockchain network is unavailable

This system is designed for scalability to handle millions of transactions across India's Ayurvedic supply chain, with government oversight through Ministry of AYUSH integration.