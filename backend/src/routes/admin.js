const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin', 'gov_admin'));

/**
 * @desc    Get system overview for admin
 * @route   GET /api/admin/overview
 * @access  Private (Admin only)
 */
router.get('/overview', asyncHandler(async (req, res) => {
  const overview = {
    systemHealth: 'healthy',
    totalUsers: 187,
    activeUsers: 156,
    pendingVerifications: 8,
    systemMetrics: {
      apiCalls: 15420,
      blockchainTransactions: 892,
      storageUsed: '2.4 GB',
      uptime: '99.8%'
    },
    alertsAndNotifications: [
      {
        type: 'warning',
        message: '3 farmers pending document verification',
        timestamp: '2024-01-26T08:30:00Z'
      },
      {
        type: 'info',
        message: 'Monthly backup completed successfully',
        timestamp: '2024-01-25T23:30:00Z'
      }
    ]
  };

  res.status(200).json({
    success: true,
    message: 'Admin overview retrieved successfully',
    data: overview
  });
}));

/**
 * @desc    Get all users for management
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
router.get('/users', asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 10 } = req.query;

  // Mock users data
  const users = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      email: 'ramesh.farmer@ayurtrace.com',
      role: 'farmer',
      status: 'active',
      isVerified: true,
      createdAt: '2024-01-10T10:30:00Z',
      lastLogin: '2024-01-25T15:20:00Z'
    },
    {
      id: 2,
      name: 'Dr. Arvind Sharma',
      email: 'arvind.manufacturer@ayurtrace.com',
      role: 'manufacturer',
      status: 'active',
      isVerified: true,
      createdAt: '2024-01-12T14:15:00Z',
      lastLogin: '2024-01-26T09:45:00Z'
    },
    {
      id: 3,
      name: 'Priya Singh',
      email: 'priya.consumer@ayurtrace.com',
      role: 'consumer',
      status: 'pending',
      isVerified: false,
      createdAt: '2024-01-20T11:20:00Z',
      lastLogin: null
    }
  ];

  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.length,
        pages: Math.ceil(users.length / limit)
      }
    }
  });
}));

module.exports = router;
