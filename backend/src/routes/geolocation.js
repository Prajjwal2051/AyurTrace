const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Get supply chain locations
router.get('/supply-chain-locations', protect, async (req, res) => {
  try {
    const mockMapData = {
      supplyChainLocations: [
        {
          id: 'farm-001',
          type: 'farm',
          name: 'Green Valley Organic Farm',
          farmer: 'Rajesh Kumar',
          coordinates: [30.0869, 78.2676], // Rishikesh, Uttarakhand
          address: 'Village Tapovan, Rishikesh, Uttarakhand 249192',
          details: {
            area: '25 acres',
            crops: ['Ashwagandha', 'Tulsi', 'Brahmi'],
            organicCertified: true,
            establishedYear: 2018,
            currentBatches: 12,
            quality: 'Grade A Premium'
          },
          batches: [
            { id: 'BATCH-F-2024-012', crop: 'Ashwagandha', quantity: '500 kg', status: 'Harvested' },
            { id: 'BATCH-F-2024-013', crop: 'Tulsi', quantity: '300 kg', status: 'Growing' }
          ]
        },
        {
          id: 'farm-002',
          type: 'farm',
          name: 'Himalayan Herbs Farm',
          farmer: 'Sunita Devi',
          coordinates: [29.9457, 78.1642], // Haridwar, Uttarakhand
          address: 'Kankhal, Haridwar, Uttarakhand 249408',
          details: {
            area: '18 acres',
            crops: ['Turmeric', 'Ginger', 'Neem'],
            organicCertified: true,
            establishedYear: 2015,
            currentBatches: 8,
            quality: 'Grade A'
          }
        },
        {
          id: 'manufacturer-001',
          type: 'manufacturer',
          name: 'Ayur Processing Industries',
          company: 'Pure Ayurveda Ltd.',
          coordinates: [28.6139, 77.2090], // New Delhi
          address: 'Sector 18, Gurgaon, Haryana 122015',
          details: {
            capacity: '5000 kg/month',
            certifications: ['GMP', 'ISO', 'FSSAI'],
            establishedYear: 2012,
            employeeCount: 45,
            processingTypes: ['Extraction', 'Powder Processing', 'Encapsulation']
          }
        },
        {
          id: 'distributor-001',
          type: 'distributor',
          name: 'Central Distribution Hub',
          company: 'AyurLogistics Pvt Ltd',
          coordinates: [19.0760, 72.8777], // Mumbai
          address: 'Andheri East, Mumbai, Maharashtra 400069',
          details: {
            warehouseArea: '50000 sq ft',
            storageCapacity: '100 tons',
            temperatureControlled: true,
            deliveryNetwork: '500+ stores'
          }
        },
        {
          id: 'retail-001',
          type: 'retail',
          name: 'Ayur Wellness Store',
          coordinates: [12.9716, 77.5946], // Bangalore
          address: 'MG Road, Bangalore, Karnataka 560001',
          details: {
            storeSize: '2000 sq ft',
            productRange: '200+ items',
            rating: 4.7
          }
        }
      ],
      supplyRoutes: [
        {
          id: 'route-001',
          from: 'farm-001',
          to: 'manufacturer-001',
          coordinates: [
            [30.0869, 78.2676],
            [28.6139, 77.2090]
          ],
          distance: '245 km',
          avgTransitTime: '6 hours',
          transportMode: 'Refrigerated Truck',
          status: 'Active'
        },
        {
          id: 'route-002',
          from: 'manufacturer-001',
          to: 'distributor-001',
          coordinates: [
            [28.6139, 77.2090],
            [19.0760, 72.8777]
          ],
          distance: '1150 km',
          avgTransitTime: '18 hours',
          transportMode: 'Express Logistics',
          status: 'In Transit'
        }
      ],
      regionalStats: {
        'North India': { farms: 45, manufacturers: 8, distributors: 3, retailers: 120 },
        'South India': { farms: 38, manufacturers: 12, distributors: 4, retailers: 95 },
        'West India': { farms: 32, manufacturers: 15, distributors: 6, retailers: 150 },
        'East India': { farms: 28, manufacturers: 5, distributors: 2, retailers: 80 }
      }
    };

    res.json({
      success: true,
      data: mockMapData
    });
  } catch (error) {
    console.error('Geolocation fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location data'
    });
  }
});

// Get batch location tracking
router.get('/batch-tracking/:batchId', protect, async (req, res) => {
  try {
    const { batchId } = req.params;
    
    // Mock batch tracking data
    const trackingData = {
      batchId,
      currentLocation: {
        lat: 28.0,
        lng: 77.5,
        address: 'Highway NH-1, Near Delhi',
        timestamp: new Date().toISOString()
      },
      journey: [
        {
          stage: 'Farm Origin',
          location: { lat: 30.0869, lng: 78.2676, address: 'Green Valley Farm, Rishikesh' },
          timestamp: '2024-09-10T08:00:00Z',
          status: 'Completed'
        },
        {
          stage: 'In Transit to Manufacturer',
          location: { lat: 28.0, lng: 77.5, address: 'Highway NH-1, Near Delhi' },
          timestamp: new Date().toISOString(),
          status: 'Current'
        },
        {
          stage: 'Manufacturing',
          location: { lat: 28.6139, lng: 77.2090, address: 'Processing Plant, Delhi' },
          timestamp: null,
          status: 'Pending'
        }
      ],
      estimatedArrival: '2024-09-18T14:30:00Z',
      transportDetails: {
        vehicle: 'Refrigerated Truck - DL1234',
        driver: 'Ramesh Kumar',
        phone: '+91-9876543210',
        temperature: '4°C',
        humidity: '65%'
      }
    };

    res.json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    console.error('Batch tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batch tracking data'
    });
  }
});

// Update location (for mobile apps or GPS devices)
router.post('/update-location', protect, async (req, res) => {
  try {
    const { batchId, lat, lng, timestamp, additionalData } = req.body;

    if (!batchId || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: batchId, lat, lng'
      });
    }

    // In a real application, this would update the database
    const locationUpdate = {
      batchId,
      coordinates: [lat, lng],
      timestamp: timestamp || new Date().toISOString(),
      additionalData,
      updatedBy: req.user.id
    };

    console.log('Location update received:', locationUpdate);

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: locationUpdate
    });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
});

// Get weather data for locations
router.get('/weather/:lat/:lng', protect, async (req, res) => {
  try {
    const { lat, lng } = req.params;
    
    // Mock weather data - in real app, integrate with weather API
    const weatherData = {
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      current: {
        temperature: '28°C',
        humidity: '65%',
        pressure: '1013 hPa',
        windSpeed: '12 km/h',
        condition: 'Partly Cloudy',
        visibility: '10 km'
      },
      forecast: [
        { day: 'Today', temp: '28°C', condition: 'Partly Cloudy', humidity: '65%' },
        { day: 'Tomorrow', temp: '30°C', condition: 'Sunny', humidity: '60%' },
        { day: 'Day After', temp: '26°C', condition: 'Light Rain', humidity: '80%' }
      ],
      alerts: []
    };

    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data'
    });
  }
});

module.exports = router;
