const express = require('express');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Most blockchain routes require authentication
router.use(protect);

/**
 * @desc    Get recent blockchain transactions
 * @route   GET /api/blockchain/transactions
 * @access  Private
 */
router.get('/transactions', asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;

  // Mock blockchain transactions
  const transactions = [
    {
      txId: 'TX_1705310200000',
      blockNumber: '12345',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'BATCH_CREATED',
      batchId: 'BATCH_001',
      details: 'New Ashwagandha batch created',
      farmer: 'Ramesh Kumar',
      status: 'confirmed'
    },
    {
      txId: 'TX_1705742100000',
      blockNumber: '12346',
      timestamp: '2024-01-20T08:15:00Z',
      type: 'BATCH_PROCESSED',
      batchId: 'BATCH_002',
      details: 'Tulsi batch processing started',
      manufacturer: 'Himalayan Herbal Industries',
      status: 'confirmed'
    }
  ];

  res.status(200).json({
    success: true,
    message: 'Blockchain transactions retrieved successfully',
    data: {
      transactions,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: transactions.length
      }
    }
  });
}));

/**
 * @desc    Get blockchain network status
 * @route   GET /api/blockchain/status
 * @access  Private
 */
router.get('/status', asyncHandler(async (req, res) => {
  const networkStatus = {
    network: 'AyurTrace Network',
    status: 'healthy',
    blockHeight: 12347,
    peersConnected: 3,
    chaincodeName: 'ayurtrace',
    channelName: 'ayurchannel',
    lastBlockTime: '2024-01-26T10:30:00Z',
    transactionCount: 150,
    networkHealth: 95.5
  };

  res.status(200).json({
    success: true,
    message: 'Blockchain network status retrieved',
    data: networkStatus
  });
}));

module.exports = router;
