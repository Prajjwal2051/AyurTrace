# AyurTrace - Blockchain-Based Ayurvedic Herb Supply Chain Traceability

## 🌿 Overview

AyurTrace is a comprehensive blockchain-based supply chain traceability system designed to address the ₹5,000+ crore annual losses from fake Ayurvedic products in India. The system provides end-to-end transparency from farm to consumer using cutting-edge technology.

## 🚀 Key Features

### 🧑‍🌾 Farmer Portal
- Herb selection (Ashwagandha, Brahmi, Tulsi, Neem, Turmeric, Amla)
- Automatic GPS coordinate capture
- A/B/C quality grading system
- Timestamp recording with seasonal validation
- Unique batch ID generation with blockchain recording
- Image upload for herbs and harvest conditions

### 🏭 Manufacturer Portal
- Available harvested herbs display with filters
- Processing step documentation (drying, grinding, extraction)
- Lab result integration for moisture, pesticides, active compounds
- Batch mixing capabilities
- QR generation for final products

### 👥 Consumer Verification Portal
- Camera-based QR scanning and instant verification
- Complete farm-to-shelf journey display
- Blockchain verification against counterfeits
- Interactive map showing herb origins
- Farmer profiles with stories and photos

### 📊 Analytics Dashboard
- Real-time counters for batches, farmers, verifications
- Heat map of herb production regions
- Quality grade distribution and seasonal patterns
- Pricing trends with farmer income tracking

### 🔗 Blockchain Ledger Viewer
- Live blockchain transaction display
- Transaction search by hash or batch ID
- Cryptographic proof display
- Network status monitoring

## 🏗️ Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB for off-chain data
- **Blockchain**: Hyperledger Fabric permissioned network
- **Frontend**: React.js with responsive design
- **Authentication**: JWT with role-based access control
- **Additional**: GPS tracking, QR generation, RESTful APIs

## 🎯 Target Users

- **Farmers**: Herb cultivation and harvest recording
- **Manufacturers**: Processing and product creation
- **Consumers**: Product verification and transparency
- **Government**: Ministry of AYUSH oversight and control
- **Admins**: System maintenance and monitoring

## 📁 Project Structure

```
AyurTrace/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Authentication, validation
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── tests/              # Backend tests
│   └── config/             # Configuration files
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Helper functions
│   │   └── assets/         # Images, styles
│   └── public/             # Static files
├── blockchain/             # Hyperledger Fabric network
│   ├── chaincodes/         # Smart contracts
│   ├── network/            # Network configuration
│   └── scripts/            # Deployment scripts
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## 🚦 Quick Start

### Prerequisites
- Node.js (v16+)
- Docker & Docker Compose
- MongoDB
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Prajjwal2051/AyurTrace.git
cd AyurTrace
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Setup Blockchain Network
```bash
cd blockchain
./scripts/setup-network.sh
./scripts/deploy-chaincode.sh
```

### 5. Initialize Sample Data
```bash
cd scripts
node seed-database.js
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/ayurtrace
MONGODB_TEST_URI=mongodb://localhost:27017/ayurtrace_test

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Blockchain
FABRIC_NETWORK_PATH=../blockchain/network
CHAINCODE_NAME=ayurtrace
CHANNEL_NAME=ayurchannel

# External Services
GPS_API_KEY=your-gps-api-key
QR_SERVICE_URL=http://localhost:3002
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Farmer Portal
- `GET /api/farmer/dashboard` - Farmer overview
- `POST /api/farmer/add-batch` - Create herb batch
- `GET /api/farmer/batches` - Get farmer's batches

### Manufacturer Portal
- `GET /api/manufacturer/available-batches` - Available herbs
- `POST /api/manufacturer/process-batch` - Add processing steps
- `GET /api/manufacturer/products` - Get products

### Consumer Portal
- `GET /api/consumer/verify/:batchId` - Verify product
- `GET /api/consumer/journey/:batchId` - Get supply chain journey

### Analytics
- `GET /api/dashboard/stats` - Real-time statistics
- `GET /api/dashboard/analytics` - Comprehensive metrics

### Blockchain
- `GET /api/blockchain/transactions` - Recent blockchain activity
- `GET /api/blockchain/block/:id` - Get block details

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run Integration Tests
```bash
npm run test:integration
```

## 🚀 Deployment

### Using Docker
```bash
# Build all services
docker-compose build

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Deployment
```bash
# Build for production
npm run build:prod

# Deploy to cloud
npm run deploy
```

## 📊 System Monitoring

### Health Checks
- Backend: `http://localhost:3001/api/health`
- Frontend: `http://localhost:3000`
- Blockchain: `http://localhost:7054`

### Logs
- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Blockchain logs: `blockchain/logs/`

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting
- Data encryption
- GDPR compliance
- Secure blockchain transactions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, contact:
- Technical Issues: [tech-support@ayurtrace.com]
- Business Inquiries: [business@ayurtrace.com]
- Government Relations: [gov-relations@ayurtrace.com]

## 🙏 Acknowledgments

- Ministry of AYUSH, Government of India
- Hyperledger Foundation
- Open source community
- Ayurvedic farmers and manufacturers

---

**Built for Smart India Hackathon 2025**
**Addressing the ₹5,000+ crore problem of fake Ayurvedic products**
