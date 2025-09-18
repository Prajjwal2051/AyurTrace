const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get supply chain analytics data
router.get('/supply-chain', auth, async (req, res) => {
  try {
    const { timeRange = '30d', region = 'all' } = req.query;
    
    // Mock analytics data - in a real application, this would come from database
    const analyticsData = {
      supplyChainMetrics: {
        totalBatches: 1247,
        averageTransitTime: 3.2,
        qualityScore: 94.5,
        farmToConsumerTime: 12.8,
        traceabilityRate: 98.2,
        sustainabilityScore: 87.3
      },
      productionTrends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Total Production (kg)',
            data: [12000, 15000, 18000, 16000, 22000, 25000, 28000, 26000, 30000],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4
          }
        ]
      },
      regionalDistribution: {
        labels: ['Uttarakhand', 'Kerala', 'Tamil Nadu', 'Karnataka', 'Madhya Pradesh', 'Gujarat'],
        datasets: [{
          data: [35, 20, 15, 12, 10, 8],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
      }
    };

    res.json({
      success: true,
      data: analyticsData,
      meta: {
        timeRange,
        region,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// Get real-time batch tracking
router.get('/tracking/realtime', auth, async (req, res) => {
  try {
    const realTimeData = {
      activeBatches: [
        {
          id: 'BATCH-F-2024-012',
          product: 'Ashwagandha',
          status: 'In Transit',
          currentLocation: {
            lat: 28.0,
            lng: 77.5,
            address: 'Highway NH-1, Near Delhi'
          },
          eta: '2024-09-18T14:30:00Z',
          progress: 75
        }
      ],
      systemStatus: {
        apiHealth: 'healthy',
        databaseStatus: 'connected',
        blockchainSync: 'synced',
        lastUpdate: new Date().toISOString()
      }
    };
    
    res.json({
      success: true,
      data: realTimeData
    });
  } catch (error) {
    console.error('Real-time tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch real-time data'
    });
  }
});

module.exports = router;
