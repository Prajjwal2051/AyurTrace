const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// All farmer routes are protected and require farmer role
router.use(protect);
router.use(authorize('farmer'));

/**
 * @desc    Get farmer dashboard data
 * @route   GET /api/farmer/dashboard
 * @access  Private (Farmer only)
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
  // Mock dashboard data - in production this would come from database
  const dashboardData = {
    totalBatches: 12,
    activeBatches: 5,
    harvestedBatches: 7,
    totalRevenue: 45000,
    recentBatches: [
      {
        batchId: 'BATCH_001',
        herbType: 'Ashwagandha',
        quantity: 250,
        unit: 'kg',
        quality: 'A',
        status: 'harvested',
        harvestDate: '2024-01-15',
        value: 12500
      },
      {
        batchId: 'BATCH_002',
        herbType: 'Tulsi',
        quantity: 180,
        unit: 'kg',
        quality: 'A',
        status: 'processing',
        harvestDate: '2024-01-20',
        value: 9000
      }
    ],
    monthlyStats: {
      January: { batches: 3, revenue: 15000 },
      February: { batches: 4, revenue: 18000 },
      March: { batches: 5, revenue: 22000 }
    }
  };

  res.status(200).json({
    success: true,
    message: 'Farmer dashboard data retrieved successfully',
    data: dashboardData
  });
}));

/**
 * @desc    Add new herb batch
 * @route   POST /api/farmer/add-batch
 * @access  Private (Farmer only)
 */
router.post('/add-batch', asyncHandler(async (req, res) => {
  const {
    herbType,
    quantity,
    qualityGrade,
    harvestDate,
    location,
    weatherConditions,
    images,
    notes
  } = req.body;

  // Basic validation
  if (!herbType || !quantity || !qualityGrade || !harvestDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: herbType, quantity, qualityGrade, harvestDate'
    });
  }

  // Generate unique batch ID
  const batchId = `BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  // Mock batch creation - in production this would save to database and blockchain
  const newBatch = {
    batchId,
    herbType,
    quantity,
    qualityGrade,
    harvestDate,
    location: location || {
      latitude: 28.7041,
      longitude: 77.1025,
      address: 'Mock Farm Location, India'
    },
    weatherConditions,
    images: images || [],
    notes,
    farmerId: req.user.id,
    status: 'harvested',
    createdAt: new Date().toISOString(),
    blockchainTx: `TX_${Date.now()}` // Mock blockchain transaction ID
  };

  res.status(201).json({
    success: true,
    message: 'Herb batch created successfully',
    data: newBatch
  });
}));

/**
 * @desc    Get all farmer's batches
 * @route   GET /api/farmer/batches
 * @access  Private (Farmer only)
 */
router.get('/batches', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, herbType } = req.query;

  // Mock batch data - in production this would come from database
  const batches = [
    {
      batchId: 'BATCH_001',
      herbType: 'Ashwagandha',
      quantity: 250,
      unit: 'kg',
      qualityGrade: 'A',
      status: 'harvested',
      harvestDate: '2024-01-15',
      location: {
        latitude: 28.7041,
        longitude: 77.1025,
        address: 'Farm 1, Rajasthan, India'
      },
      createdAt: '2024-01-15T10:30:00Z',
      blockchainTx: 'TX_1705310200000'
    },
    {
      batchId: 'BATCH_002',
      herbType: 'Tulsi',
      quantity: 180,
      unit: 'kg',
      qualityGrade: 'A',
      status: 'processing',
      harvestDate: '2024-01-20',
      location: {
        latitude: 28.7041,
        longitude: 77.1025,
        address: 'Farm 1, Rajasthan, India'
      },
      createdAt: '2024-01-20T08:15:00Z',
      blockchainTx: 'TX_1705742100000'
    }
  ];

  // Apply filters (mock implementation)
  let filteredBatches = batches;
  if (status) {
    filteredBatches = filteredBatches.filter(batch => batch.status === status);
  }
  if (herbType) {
    filteredBatches = filteredBatches.filter(batch => batch.herbType === herbType);
  }

  res.status(200).json({
    success: true,
    message: 'Farmer batches retrieved successfully',
    data: {
      batches: filteredBatches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredBatches.length,
        pages: Math.ceil(filteredBatches.length / limit)
      }
    }
  });
}));

/**
 * @desc    Get specific batch details
 * @route   GET /api/farmer/batches/:batchId
 * @access  Private (Farmer only)
 */
router.get('/batches/:batchId', asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  // Mock batch details - in production this would come from database
  const batchDetails = {
    batchId,
    herbType: 'Ashwagandha',
    quantity: 250,
    unit: 'kg',
    qualityGrade: 'A',
    status: 'harvested',
    harvestDate: '2024-01-15',
    location: {
      latitude: 28.7041,
      longitude: 77.1025,
      address: 'Farm 1, Rajasthan, India'
    },
    weatherConditions: {
      temperature: 25,
      humidity: 60,
      rainfall: 2.5,
      sunlight: 8
    },
    qualityParameters: {
      moisture: 8.5,
      purity: 96.5,
      activeCompounds: [
        { name: 'Withanolides', value: 2.8, unit: '%' }
      ]
    },
    images: ['ashwagandha_001.jpg', 'farm_location_001.jpg'],
    blockchainHistory: [
      {
        txId: 'TX_1705310200000',
        action: 'BATCH_CREATED',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Batch created and recorded on blockchain'
      }
    ],
    createdAt: '2024-01-15T10:30:00Z'
  };

  res.status(200).json({
    success: true,
    message: 'Batch details retrieved successfully',
    data: batchDetails
  });
}));

module.exports = router;
