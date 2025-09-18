const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const hpp = require('hpp');
const winston = require('winston');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmer');
const manufacturerRoutes = require('./routes/manufacturer');
const consumerRoutes = require('./routes/consumer');
const blockchainRoutes = require('./routes/blockchain');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const geolocationRoutes = require('./routes/geolocation');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Initialize Express app
const app = express();

// Configure Winston Logger
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'ayurtrace-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000, // 15 minutes default
  max: process.env.RATE_LIMIT_MAX || 200, // limit each IP to 200 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    resetTime: new Date(Date.now() + (process.env.RATE_LIMIT_WINDOW_MIN || 15) * 60 * 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to API routes only
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN ? 
      process.env.CORS_ORIGIN.split(',') : 
      ['http://localhost:3000', 'http://localhost:3001'];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
});

// Prevent parameter pollution
app.use(hpp());

// Request logging middleware
app.use(logger);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'AyurTrace API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Documentation route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to AyurTrace API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      authentication: '/api/auth',
      farmer: '/api/farmer',
      manufacturer: '/api/manufacturer',
      consumer: '/api/consumer',
      blockchain: '/api/blockchain',
      dashboard: '/api/dashboard',
      admin: '/api/admin',
      analytics: '/api/analytics',
      geolocation: '/api/geolocation'
    },
    status: 'operational'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/manufacturer', manufacturerRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/geolocation', geolocationRoutes);

// Blockchain event listeners setup
const setupBlockchainListeners = () => {
  // This would be implemented when Hyperledger Fabric network is set up
  winstonLogger.info('Blockchain event listeners initialized');
};

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI;

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    winstonLogger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up blockchain listeners after DB connection
    setupBlockchainListeners();
    
  } catch (error) {
    winstonLogger.warn('MongoDB connection failed - running in demo mode:', error.message);
    winstonLogger.info('API will work with mock data');
    // Don't exit - continue with mock data
    setupBlockchainListeners();
  }
};

// Connect to database (or continue without it for demo)
connectDB();

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  winstonLogger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  winstonLogger.info('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    winstonLogger.info('MongoDB connection closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  winstonLogger.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  winstonLogger.error('Uncaught Exception:', err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  winstonLogger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 AyurTrace API Server`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`💊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
});

// Initialize WebSocket server
const socketServer = require('./websocket/socketServer');
socketServer.initialize(server);
console.log('📡 WebSocket server initialized for real-time features');

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      winstonLogger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      winstonLogger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

module.exports = app;
