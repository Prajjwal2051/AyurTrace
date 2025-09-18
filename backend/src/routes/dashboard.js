const express = require('express');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Dashboard routes require authentication
router.use(protect);

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = {
    totalBatches: 156,
    totalFarmers: 45,
    totalManufacturers: 12,
    totalVerifications: 892,
    recentActivity: [
      {
        type: 'batch_created',
        message: 'New Ashwagandha batch created by Ramesh Kumar',
        timestamp: '2024-01-26T10:30:00Z',
        batchId: 'BATCH_001'
      },
      {
        type: 'verification',
        message: 'Product BATCH_002 verified by consumer',
        timestamp: '2024-01-26T09:15:00Z',
        batchId: 'BATCH_002'
      }
    ],
    monthlyGrowth: {
      batches: 15.2,
      farmers: 8.7,
      verifications: 23.4
    }
  };

  res.status(200).json({
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: stats
  });
}));

/**
 * @desc    Get comprehensive analytics
 * @route   GET /api/dashboard/analytics
 * @access  Private
 */
router.get('/analytics', asyncHandler(async (req, res) => {
  const analytics = {
    herbTypeDistribution: {
      Ashwagandha: 35,
      Tulsi: 28,
      Neem: 20,
      Turmeric: 12,
      Brahmi: 8,
      Amla: 5
    },
    qualityGradeDistribution: {
      A: 60,
      B: 30,
      C: 10
    },
    regionalDistribution: {
      'Rajasthan': 40,
      'Uttarakhand': 25,
      'Gujarat': 15,
      'Maharashtra': 12,
      'Other': 8
    },
    monthlyTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      batches: [45, 52, 48, 61, 55, 67],
      verifications: [120, 145, 167, 198, 223, 241]
    },
    verificationHeatmap: [
      { state: 'Maharashtra', verifications: 250 },
      { state: 'Delhi', verifications: 180 },
      { state: 'Karnataka', verifications: 160 },
      { state: 'Gujarat', verifications: 140 },
      { state: 'Rajasthan', verifications: 120 }
    ]
  };

  res.status(200).json({
    success: true,
    message: 'Analytics data retrieved successfully',
    data: analytics
  });
}));

module.exports = router;
