const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// All manufacturer routes are protected and require manufacturer role
router.use(protect);
router.use(authorize('manufacturer'));

/**
 * @desc    Get available batches for processing
 * @route   GET /api/manufacturer/available-batches
 * @access  Private (Manufacturer only)
 */
router.get('/available-batches', asyncHandler(async (req, res) => {
  const { herbType, qualityGrade, location } = req.query;

  // Mock available batches data
  const availableBatches = [
    {
      batchId: 'BATCH_001',
      herbType: 'Ashwagandha',
      quantity: 250,
      unit: 'kg',
      qualityGrade: 'A',
      harvestDate: '2024-01-15',
      farmerName: 'Ramesh Kumar',
      farmLocation: 'Rajasthan, India',
      price: 50, // per kg
      totalValue: 12500,
      availableForProcessing: true
    },
    {
      batchId: 'BATCH_003',
      herbType: 'Neem',
      quantity: 320,
      unit: 'kg',
      qualityGrade: 'B',
      harvestDate: '2024-02-10',
      farmerName: 'Sunita Devi',
      farmLocation: 'Rajasthan, India',
      price: 30,
      totalValue: 9600,
      availableForProcessing: true
    }
  ];

  res.status(200).json({
    success: true,
    message: 'Available batches retrieved successfully',
    data: { batches: availableBatches, count: availableBatches.length }
  });
}));

/**
 * @desc    Process a batch
 * @route   POST /api/manufacturer/process-batch
 * @access  Private (Manufacturer only)
 */
router.post('/process-batch', asyncHandler(async (req, res) => {
  const { batchId, processingStep, parameters, notes } = req.body;

  if (!batchId || !processingStep) {
    return res.status(400).json({
      success: false,
      message: 'Batch ID and processing step are required'
    });
  }

  const processedBatch = {
    batchId,
    processingStep,
    parameters: parameters || {},
    processedBy: req.user.id,
    processedAt: new Date().toISOString(),
    notes,
    status: 'processing',
    blockchainTx: `TX_${Date.now()}`
  };

  res.status(200).json({
    success: true,
    message: 'Batch processing recorded successfully',
    data: processedBatch
  });
}));

module.exports = router;
