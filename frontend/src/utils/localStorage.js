// Local Storage utility for AyurTrace
class LocalStorageManager {
  constructor() {
    this.prefix = 'ayurTrace_';
    this.initializeData();
  }

  // Initialize default data structure
  initializeData() {
    if (!this.getData('initialized')) {
      const defaultData = {
        initialized: true,
        version: '1.0.0',
        batches: [
          {
            id: 'BATCH-F-2024-012',
            farmerId: 'farmer001',
            farmerName: 'Rajesh Kumar',
            farmName: 'Green Valley Herbs Farm',
            crop: 'Ashwagandha',
            variety: 'WS-3 Premium',
            quantity: '500 kg',
            plantingDate: '2024-03-15',
            harvestDate: '2024-08-15',
            quality: 'Grade A Premium',
            status: 'Harvested',
            location: 'Rishikesh, Uttarakhand',
            coordinates: [30.0869, 78.2676],
            certifications: ['Organic', 'NPOP'],
            createdAt: '2024-03-15T08:00:00Z',
            updatedAt: '2024-08-15T10:30:00Z'
          },
          {
            id: 'BATCH-F-2024-013',
            farmerId: 'farmer001',
            farmerName: 'Rajesh Kumar',
            farmName: 'Green Valley Herbs Farm',
            crop: 'Tulsi',
            variety: 'Krishna Tulsi',
            quantity: '300 kg',
            plantingDate: '2024-04-01',
            harvestDate: null,
            quality: 'Grade A',
            status: 'Growing',
            location: 'Rishikesh, Uttarakhand',
            coordinates: [30.0869, 78.2676],
            certifications: ['Organic'],
            createdAt: '2024-04-01T08:00:00Z',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'BATCH-F-2024-014',
            farmerId: 'farmer001',
            farmerName: 'Rajesh Kumar',
            farmName: 'Green Valley Herbs Farm',
            crop: 'Brahmi',
            variety: 'Bacopa Monnieri',
            quantity: '400 kg',
            plantingDate: '2024-05-10',
            harvestDate: null,
            quality: 'Grade A',
            status: 'Vegetative',
            location: 'Rishikesh, Uttarakhand',
            coordinates: [30.0869, 78.2676],
            certifications: ['Organic'],
            createdAt: '2024-05-10T08:00:00Z',
            updatedAt: new Date().toISOString()
          }
        ],
        products: [
          {
            id: 'PROD-M-2024-001',
            batchId: 'BATCH-F-2024-012',
            manufacturerId: 'mfg001',
            manufacturerName: 'Priya Sharma',
            companyName: 'Ayur Processing Co.',
            productName: 'Ashwagandha Capsules',
            productType: 'Capsule',
            quantity: '5000 units',
            processingDate: '2024-08-20',
            expiryDate: '2026-08-20',
            batchNumber: 'AC-2024-001',
            status: 'Quality Control',
            qualityTests: [
              { test: 'Microbiological', result: 'Pass', date: '2024-08-21' },
              { test: 'Heavy Metals', result: 'Pass', date: '2024-08-21' },
              { test: 'Active Compounds', result: 'Pass', date: '2024-08-22' }
            ],
            createdAt: '2024-08-20T09:00:00Z',
            updatedAt: new Date().toISOString()
          }
        ],
        verifications: [
          {
            id: 'VER-2024-001',
            consumerId: 'consumer001',
            batchId: 'BATCH-F-2024-012',
            productId: 'PROD-M-2024-001',
            verificationDate: new Date().toISOString(),
            status: 'Verified',
            confidence: 98.5,
            location: 'Mumbai, Maharashtra'
          }
        ],
        analytics: {
          lastUpdated: new Date().toISOString(),
          totalBatches: 3,
          totalProducts: 1,
          totalVerifications: 1,
          qualityScore: 94.5,
          traceabilityRate: 98.2
        }
      };

      // Store each data type
      Object.keys(defaultData).forEach(key => {
        this.setData(key, defaultData[key]);
      });
    }
  }

  // Generic get/set methods
  getData(key) {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting data from localStorage:', error);
      return null;
    }
  }

  setData(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting data to localStorage:', error);
      return false;
    }
  }

  removeData(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
      return false;
    }
  }

  // Batch management
  getBatches(farmerId = null) {
    const batches = this.getData('batches') || [];
    return farmerId ? batches.filter(batch => batch.farmerId === farmerId) : batches;
  }

  addBatch(batch) {
    const batches = this.getBatches();
    const newBatch = {
      ...batch,
      id: batch.id || `BATCH-F-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    batches.push(newBatch);
    return this.setData('batches', batches);
  }

  updateBatch(batchId, updates) {
    const batches = this.getBatches();
    const index = batches.findIndex(batch => batch.id === batchId);
    if (index !== -1) {
      batches[index] = {
        ...batches[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.setData('batches', batches);
    }
    return false;
  }

  deleteBatch(batchId) {
    const batches = this.getBatches();
    const filtered = batches.filter(batch => batch.id !== batchId);
    return this.setData('batches', filtered);
  }

  // Product management
  getProducts(manufacturerId = null) {
    const products = this.getData('products') || [];
    return manufacturerId ? products.filter(product => product.manufacturerId === manufacturerId) : products;
  }

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      ...product,
      id: product.id || `PROD-M-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    return this.setData('products', products);
  }

  updateProduct(productId, updates) {
    const products = this.getProducts();
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.setData('products', products);
    }
    return false;
  }

  // Verification management
  getVerifications(consumerId = null) {
    const verifications = this.getData('verifications') || [];
    return consumerId ? verifications.filter(v => v.consumerId === consumerId) : verifications;
  }

  addVerification(verification) {
    const verifications = this.getVerifications();
    const newVerification = {
      ...verification,
      id: verification.id || `VER-${Date.now()}`,
      verificationDate: new Date().toISOString()
    };
    verifications.push(newVerification);
    return this.setData('verifications', verifications);
  }

  // Supply chain tracking
  getSupplyChainJourney(batchId) {
    const batches = this.getBatches();
    const products = this.getProducts();
    const verifications = this.getVerifications();

    const batch = batches.find(b => b.id === batchId);
    if (!batch) return null;

    const relatedProducts = products.filter(p => p.batchId === batchId);
    const relatedVerifications = verifications.filter(v => v.batchId === batchId);

    return {
      batch,
      products: relatedProducts,
      verifications: relatedVerifications,
      journey: [
        {
          stage: 'Farm Origin',
          date: batch.createdAt,
          location: batch.location,
          responsible: batch.farmerName,
          status: 'Completed',
          details: {
            crop: batch.crop,
            variety: batch.variety,
            quantity: batch.quantity,
            quality: batch.quality
          }
        },
        ...(relatedProducts.map(product => ({
          stage: 'Manufacturing',
          date: product.processingDate,
          location: 'Processing Facility',
          responsible: product.manufacturerName,
          status: product.status,
          details: {
            productName: product.productName,
            productType: product.productType,
            quantity: product.quantity
          }
        }))),
        ...(relatedVerifications.map(verification => ({
          stage: 'Consumer Verification',
          date: verification.verificationDate,
          location: verification.location,
          responsible: 'Consumer',
          status: verification.status,
          details: {
            confidence: verification.confidence
          }
        })))
      ]
    };
  }

  // Analytics data
  updateAnalytics() {
    const batches = this.getBatches();
    const products = this.getProducts();
    const verifications = this.getVerifications();

    const analytics = {
      lastUpdated: new Date().toISOString(),
      totalBatches: batches.length,
      totalProducts: products.length,
      totalVerifications: verifications.length,
      qualityScore: this.calculateQualityScore(batches),
      traceabilityRate: this.calculateTraceabilityRate(batches, products),
      farmersCount: new Set(batches.map(b => b.farmerId)).size,
      manufacturersCount: new Set(products.map(p => p.manufacturerId)).size,
      consumersCount: new Set(verifications.map(v => v.consumerId)).size
    };

    this.setData('analytics', analytics);
    return analytics;
  }

  calculateQualityScore(batches) {
    if (batches.length === 0) return 0;
    
    const qualityScores = {
      'Grade A Premium': 100,
      'Grade A': 85,
      'Grade B+': 70,
      'Grade B': 60,
      'Grade C': 40
    };

    const totalScore = batches.reduce((sum, batch) => {
      return sum + (qualityScores[batch.quality] || 50);
    }, 0);

    return (totalScore / batches.length).toFixed(1);
  }

  calculateTraceabilityRate(batches, products) {
    if (batches.length === 0) return 0;
    
    const traceableBatches = batches.filter(batch => {
      return products.some(product => product.batchId === batch.id);
    });

    return ((traceableBatches.length / batches.length) * 100).toFixed(1);
  }

  // Clear all data
  clearAllData() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
    this.initializeData();
  }

  // Export data
  exportData() {
    const data = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        const cleanKey = key.replace(this.prefix, '');
        data[cleanKey] = this.getData(cleanKey);
      }
    });
    return data;
  }

  // Import data
  importData(data) {
    try {
      Object.keys(data).forEach(key => {
        this.setData(key, data[key]);
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Create singleton instance
const localStorageManager = new LocalStorageManager();

export default localStorageManager;
