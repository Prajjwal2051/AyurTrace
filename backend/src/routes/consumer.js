const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * @desc    Verify product by batch ID
 * @route   GET /api/consumer/verify/:batchId
 * @access  Public
 */
router.get('/verify/:batchId', asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  // Mock verification data
  const verificationResult = {
    batchId,
    isAuthentic: true,
    verificationStatus: 'verified',
    product: {
      name: 'Organic Ashwagandha Powder',
      herbType: 'Ashwagandha',
      qualityGrade: 'A',
      manufacturingDate: '2024-01-25',
      expiryDate: '2025-01-25',
      manufacturer: 'Himalayan Herbal Industries'
    },
    farmer: {
      name: 'Ramesh Kumar',
      farmName: 'Ramesh Organic Herbs Farm',
      location: 'Rajasthan, India',
      organicCertified: true
    },
    supplyChain: [
      {
        stage: 'Harvest',
        date: '2024-01-15',
        location: 'Farm - Rajasthan, India',
        operator: 'Ramesh Kumar',
        details: 'Organic harvest, Grade A quality'
      },
      {
        stage: 'Processing',
        date: '2024-01-20',
        location: 'Processing Facility - Haridwar',
        operator: 'Himalayan Herbal Industries',
        details: 'Dried and ground using traditional methods'
      },
      {
        stage: 'Quality Testing',
        date: '2024-01-22',
        location: 'Quality Lab - Haridwar',
        operator: 'Certified Lab',
        details: 'All quality parameters passed'
      },
      {
        stage: 'Packaging',
        date: '2024-01-25',
        location: 'Packaging Unit - Haridwar',
        operator: 'Himalayan Herbal Industries',
        details: 'Sealed in food-grade packaging'
      }
    ],
    blockchainProof: {
      transactionHash: 'TX_1705310200000',
      blockNumber: '12345',
      timestamp: '2024-01-15T10:30:00Z',
      verified: true
    },
    verificationCount: 1,
    verifiedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    message: 'Product verification completed',
    data: verificationResult
  });
}));

/**
 * @desc    Get complete product journey
 * @route   GET /api/consumer/journey/:batchId
 * @access  Public
 */
router.get('/journey/:batchId', asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  const journeyData = {
    batchId,
    productName: 'Organic Ashwagandha Powder',
    currentStatus: 'delivered',
    timeline: [
      {
        stage: 'Seed Planted',
        date: '2023-10-01',
        location: { lat: 28.7041, lng: 77.1025, name: 'Organic Farm, Rajasthan' },
        description: 'High-quality Ashwagandha seeds planted',
        images: ['planting_001.jpg']
      },
      {
        stage: 'Harvest Ready',
        date: '2024-01-15',
        location: { lat: 28.7041, lng: 77.1025, name: 'Organic Farm, Rajasthan' },
        description: 'Plants matured and ready for harvest',
        images: ['mature_plants_001.jpg']
      },
      {
        stage: 'Harvested',
        date: '2024-01-15',
        location: { lat: 28.7041, lng: 77.1025, name: 'Organic Farm, Rajasthan' },
        description: '250 kg of Grade A Ashwagandha harvested',
        images: ['harvest_001.jpg'],
        qualityData: { grade: 'A', moisture: 8.5, purity: 96.5 }
      },
      {
        stage: 'Processing',
        date: '2024-01-20',
        location: { lat: 29.9457, lng: 78.1642, name: 'Processing Facility, Haridwar' },
        description: 'Traditional drying and grinding process',
        images: ['processing_001.jpg'],
        processingDetails: { method: 'sun-dried', temperature: '45°C', duration: '48 hours' }
      },
      {
        stage: 'Quality Testing',
        date: '2024-01-22',
        location: { lat: 29.9457, lng: 78.1642, name: 'Quality Lab, Haridwar' },
        description: 'Comprehensive quality tests completed',
        testResults: {
          withanolides: '2.8%',
          heavyMetals: 'Within limits',
          microbiology: 'Safe',
          pesticides: 'Not detected'
        }
      },
      {
        stage: 'Packaged',
        date: '2024-01-25',
        location: { lat: 29.9457, lng: 78.1642, name: 'Packaging Unit, Haridwar' },
        description: 'Product packaged with QR code for traceability',
        packageDetails: { weight: '100g', material: 'Food-grade pouch', batchSize: '500 units' }
      },
      {
        stage: 'Shipped',
        date: '2024-01-26',
        location: { lat: 29.9457, lng: 78.1642, name: 'Distribution Center, Haridwar' },
        description: 'Shipped to retail stores',
        shippingDetails: { carrier: 'Cold Chain Logistics', trackingId: 'CC123456789' }
      }
    ],
    certifications: [
      { type: 'Organic', issuedBy: 'APEDA', validUntil: '2025-12-31' },
      { type: 'GMP', issuedBy: 'AYUSH Ministry', validUntil: '2025-06-30' }
    ]
  };

  res.status(200).json({
    success: true,
    message: 'Product journey retrieved successfully',
    data: journeyData
  });
}));

module.exports = router;
