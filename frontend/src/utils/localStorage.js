// Local Storage utility for AyurTrace
class LocalStorageManager {
  constructor() {
    this.prefix = 'ayurTrace_';
    this.initializeData();
  }

  // Force refresh data (for development/debugging)
  forceRefresh() {
    this.clearAllData();
    this.initializeData();
  }

  // Initialize default data structure  
  initializeData() {
    // Force re-initialization to include BATCH-F-2024-015 data
    const currentVersion = this.getData('version');
    if (!this.getData('initialized') || currentVersion !== '1.0.1') {
      const defaultData = {
        initialized: true,
        version: '1.0.1',
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
          },
          {
            id: 'BATCH-F-2024-015',
            farmerId: 'farmer002',
            farmerName: 'Priya Patel',
            farmName: 'Himalayan Herbs Co.',
            crop: 'Turmeric',
            variety: 'Curcuma Longa Premium',
            quantity: '600 kg',
            plantingDate: '2024-02-20',
            harvestDate: '2024-07-15',
            quality: 'Grade A Premium',
            status: 'Harvested',
            location: 'Shimla, Himachal Pradesh',
            coordinates: [31.1048, 77.1734],
            certifications: ['Organic', 'Fair Trade'],
            createdAt: '2024-02-20T09:00:00Z',
            updatedAt: '2024-07-15T14:20:00Z'
          },
          {
            id: 'BATCH-F-2024-016',
            farmerId: 'farmer003',
            farmerName: 'Amit Singh',
            farmName: 'Organic Spice Gardens',
            crop: 'Ginger',
            variety: 'Zingiber Officinale',
            quantity: '350 kg',
            plantingDate: '2024-03-10',
            harvestDate: '2024-08-10',
            quality: 'Grade A',
            status: 'Ready for Processing',
            location: 'Coorg, Karnataka',
            coordinates: [12.3375, 75.8069],
            certifications: ['Organic'],
            createdAt: '2024-03-10T10:00:00Z',
            updatedAt: '2024-08-10T11:45:00Z'
          }
        ],
        manufacturingRecords: [
          {
            id: 'MFG-2024-001',
            batchId: 'BATCH-F-2024-012',
            manufacturerId: 'mfg001',
            manufacturerName: 'Priya Sharma',
            facilityName: 'Ayur Processing Co. - Unit 1',
            process: 'Steam Distillation',
            qualityTestResult: 'Passed',
            expectedYield: '450 kg',
            actualYield: '445 kg',
            processingNotes: 'Standard processing with optimal temperature control.',
            processingDate: '2024-08-18',
            completionDate: '2024-08-20',
            status: 'Completed',
            blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890fedcba09',
            createdAt: '2024-08-18T09:00:00Z',
            updatedAt: '2024-08-20T15:30:00Z'
          },
          {
            id: 'MFG-2024-002',
            batchId: 'BATCH-F-2024-015',
            manufacturerId: 'mfg002',
            manufacturerName: 'Arvind Kumar',
            facilityName: 'Himalayan Herbs Processing - Main Unit',
            process: 'Traditional Drying & Grinding',
            qualityTestResult: 'Passed',
            expectedYield: '550 kg',
            actualYield: '545 kg',
            processingNotes: 'Premium turmeric processed using traditional methods for maximum curcumin retention.',
            processingDate: '2024-07-20',
            completionDate: '2024-07-25',
            status: 'Completed',
            blockchainHash: '0x2b3c4d5e6f7890abcdef1234567890fedcba0987',
            createdAt: '2024-07-20T10:00:00Z',
            updatedAt: '2024-07-25T16:45:00Z'
          }
        ],
        products: [
          {
            id: 'PROD-M-2024-001',
            batchId: 'BATCH-F-2024-012',
            manufacturerId: 'mfg001',
            manufacturerName: 'Ayur Processing Co.',
            companyName: 'Ayur Processing Co.',
            productName: 'Ashwagandha Capsules',
            productType: 'Capsule',
            quantity: '5000 units',
            processingDate: '2024-08-20',
            expiryDate: '2026-08-20',
            batchNumber: 'AC-2024-001',
            status: 'Ready for Market',
            qrCode: 'QR_PROD_M_2024_001',
            qualityTests: [
              { test: 'Microbiological', result: 'Pass', date: '2024-08-21' },
              { test: 'Heavy Metals', result: 'Pass', date: '2024-08-21' },
              { test: 'Active Compounds', result: 'Pass', date: '2024-08-22' }
            ],
            createdAt: '2024-08-20T09:00:00Z',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'PROD-M-2024-002',
            batchId: 'BATCH-F-2024-015',
            manufacturerId: 'mfg002',
            manufacturerName: 'Himalayan Herbs Processing',
            companyName: 'Himalayan Herbs Processing',
            productName: 'Organic Turmeric Powder',
            productType: 'Powder',
            quantity: '2000 packets',
            processingDate: '2024-08-22',
            expiryDate: '2025-08-22',
            batchNumber: 'TP-2024-002',
            status: 'Ready for Market',
            qrCode: 'QR_PROD_M_2024_002',
            qualityTests: [
              { test: 'Purity Analysis', result: 'Pass', date: '2024-08-23' },
              { test: 'Curcumin Content', result: 'Pass', date: '2024-08-23' },
              { test: 'Moisture Content', result: 'Pass', date: '2024-08-24' }
            ],
            createdAt: '2024-08-22T11:00:00Z',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'PROD-M-2024-003',
            batchId: 'BATCH-F-2024-015',
            manufacturerId: 'mfg002',
            manufacturerName: 'Himalayan Herbs Processing',
            companyName: 'Himalayan Herbs Processing',
            productName: 'Premium Turmeric Extract',
            productType: 'Extract',
            quantity: '1000 bottles',
            processingDate: '2024-08-25',
            expiryDate: '2025-08-25',
            batchNumber: 'TE-2024-003',
            status: 'Ready for Market',
            qrCode: 'QR_PROD_M_2024_003',
            qualityTests: [
              { test: 'Curcumin Concentration', result: 'Pass', date: '2024-08-26' },
              { test: 'Stability Test', result: 'Pass', date: '2024-08-26' },
              { test: 'Bioavailability Test', result: 'Pass', date: '2024-08-27' }
            ],
            createdAt: '2024-08-25T14:00:00Z',
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
          },
          {
            id: 'VER-2024-002',
            consumerId: 'consumer002',
            batchId: 'BATCH-F-2024-015',
            productId: 'PROD-M-2024-002',
            verificationDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            status: 'Verified',
            confidence: 97.8,
            location: 'Delhi, NCR'
          },
          {
            id: 'VER-2024-003',
            consumerId: 'consumer003',
            batchId: 'BATCH-F-2024-015',
            productId: 'PROD-M-2024-003',
            verificationDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            status: 'Verified',
            confidence: 99.2,
            location: 'Bangalore, Karnataka'
          }
        ],
        blockchainTransactions: [
          {
            hash: '0x1a2b3c4d5e6f7890abcdef1234567890fedcba0987654321abcdef1234567890',
            type: 'batch_creation',
            from: 'Rajesh Kumar',
            to: 'AyurTrace Network',
            batchId: 'BATCH-F-2024-012',
            value: '1 AYUR',
            timestamp: '2024-03-15T08:00:00Z',
            blockNumber: 12345,
            transactionIndex: 0,
            gasUsed: '21000',
            gasPrice: '20 gwei',
            nonce: 1,
            description: 'New Ashwagandha batch registered on blockchain with quality certification'
          },
          {
            hash: '0x2b3c4d5e6f7890abcdef1234567890fedcba0987654321abcdef1234567890ab',
            type: 'manufacturing',
            from: 'Ayur Processing Co.',
            to: 'AyurTrace Network',
            batchId: 'BATCH-F-2024-012',
            manufacturingId: 'MFG-2024-001',
            value: '2 AYUR',
            timestamp: '2024-08-18T09:00:00Z',
            blockNumber: 12367,
            transactionIndex: 2,
            gasUsed: '45000',
            gasPrice: '22 gwei',
            nonce: 15,
            description: 'Steam distillation process completed with blockchain verification'
          },
          {
            hash: '0x3c4d5e6f7890abcdef1234567890fedcba0987654321abcdef1234567890ab2c',
            type: 'product_creation',
            from: 'Ayur Processing Co.',
            to: 'AyurTrace Network',
            batchId: 'BATCH-F-2024-012',
            productId: 'PROD-M-2024-001',
            value: '3 AYUR',
            timestamp: '2024-08-20T11:00:00Z',
            blockNumber: 12389,
            transactionIndex: 1,
            gasUsed: '35000',
            gasPrice: '25 gwei',
            nonce: 18,
            description: 'Ashwagandha capsules packaged and registered with QR codes'
          },
          {
            hash: '0x4d5e6f7890abcdef1234567890fedcba0987654321abcdef1234567890ab2c3d',
            type: 'verification',
            from: 'Consumer',
            to: 'AyurTrace Network',
            batchId: 'BATCH-F-2024-012',
            productId: 'PROD-M-2024-001',
            value: '0.1 AYUR',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            blockNumber: 12401,
            transactionIndex: 3,
            gasUsed: '15000',
            gasPrice: '18 gwei',
            nonce: 42,
            description: 'Consumer verified product authenticity through QR scan'
          },
          {
            hash: '0x5e6f7890abcdef1234567890fedcba0987654321abcdef1234567890ab2c3d4e',
            type: 'batch_creation',
            from: 'Priya Patel',
            to: 'AyurTrace Network',
            batchId: 'BATCH-F-2024-015',
            value: '1.5 AYUR',
            timestamp: '2024-02-20T09:00:00Z',
            blockNumber: 12234,
            transactionIndex: 0,
            gasUsed: '22000',
            gasPrice: '19 gwei',
            nonce: 3,
            description: 'Premium Turmeric batch registered with organic certification'
          },
          {
            hash: '0x6f7890abcdef1234567890fedcba0987654321abcdef1234567890ab2c3d4e5f',
            type: 'quality_test',
            from: 'Quality Lab',
            to: 'AyurTrace Network',
            batchId: 'BATCH-F-2024-015',
            value: '0.5 AYUR',
            timestamp: '2024-07-18T14:30:00Z',
            blockNumber: 12356,
            transactionIndex: 1,
            gasUsed: '28000',
            gasPrice: '21 gwei',
            nonce: 8,
            description: 'Comprehensive quality testing completed - all parameters passed'
          }
        ],
        analytics: {
          lastUpdated: new Date().toISOString(),
          totalBatches: 5,
          totalProducts: 2,
          totalVerifications: 1,
          totalManufacturingRecords: 1,
          totalBlockchainTransactions: 6,
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
      // eslint-disable-next-line no-console
      console.error('Error getting data from localStorage:', error);
      return null;
    }
  }

  setData(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error setting data to localStorage:', error);
      return false;
    }
  }

  removeData(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
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

  // Get batches available for processing
  getBatchesForProcessing() {
    const batches = this.getBatches();
    return batches.filter(batch => 
      batch.status === 'Harvested' || 
      batch.status === 'Ready for Processing' ||
      batch.status === 'Quality Tested'
    );
  }

  // Product management
  getProducts(manufacturerId = null) {
    const products = this.getData('products') || [];
    return manufacturerId ? products.filter(product => product.manufacturerId === manufacturerId) : products;
  }

  // Get batches available for purchase by manufacturers
  getAvailableBatchesForPurchase() {
    const batches = this.getBatches();
    // Exclude already purchased/processing/completed batches
    const excludedStatuses = ['Purchased', 'Processing', 'Processing by Manufacturer', 'Manufactured', 'Delivered'];
    return batches.filter(b => !excludedStatuses.includes(b.status));
  }

  // Create a manufacturing record from a batch
  createManufacturingRecordFromBatch(batch, manufacturer) {
    const records = this.getManufacturingRecords();
    const newRecord = {
      id: `MFG-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      batchId: batch.id,
      manufacturerId: manufacturer?.id || 'mfg_demo',
      manufacturerName: manufacturer?.name || manufacturer?.companyName || 'Demo Manufacturer',
      facilityName: manufacturer?.facilityName || `${manufacturer?.companyName || 'Processing Facility'} - Unit 1`,
      process: 'Initial Processing',
      qualityTestResult: 'Pending',
      expectedYield: batch.quantity || 'N/A',
      actualYield: null,
      processingNotes: 'Auto-generated after purchase',
      processingDate: new Date().toISOString(),
      completionDate: null,
      status: 'Processing',
      blockchainHash: this.generateBlockchainHash({ batchId: batch.id, ts: Date.now() }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    records.push(newRecord);
    this.setData('manufacturingRecords', records);

    // Add blockchain tx
    this.addBlockchainTransaction({
      type: 'manufacturing',
      from: newRecord.manufacturerName,
      to: 'AyurTrace Network',
      batchId: newRecord.batchId,
      manufacturingId: newRecord.id,
      value: '2 AYUR',
      timestamp: newRecord.createdAt,
      description: `${newRecord.process} started at ${newRecord.facilityName}`
    });

    return newRecord;
  }

  // Create a product from a manufacturing record
  createProductFromManufacturing(manufacturingRecord, productName) {
    const products = this.getProducts();
    const newProduct = {
      id: `PROD-M-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      batchId: manufacturingRecord.batchId,
      manufacturerId: manufacturingRecord.manufacturerId,
      manufacturerName: manufacturingRecord.manufacturerName,
      companyName: manufacturingRecord.manufacturerName,
      productName: productName || `${this.getBatches().find(b => b.id === manufacturingRecord.batchId)?.crop || 'Herb'} Product`,
      productType: 'Packaged',
      quantity: '1000 units',
      processingDate: new Date().toISOString(),
      expiryDate: `${new Date().getFullYear() + 1}-12-31`,
      batchNumber: `BN-${String(Date.now()).slice(-5)}`,
      status: 'Ready for Market',
      qrCode: `QR_${String(Date.now())}`,
      qualityTests: [
        { test: 'Microbiological', result: 'Pass', date: new Date().toISOString().split('T')[0] }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    this.setData('products', products);

    // Add blockchain tx
    this.addBlockchainTransaction({
      type: 'product_creation',
      from: newProduct.manufacturerName,
      to: 'AyurTrace Network',
      batchId: newProduct.batchId,
      productId: newProduct.id,
      value: '3 AYUR',
      timestamp: newProduct.createdAt,
      description: `${newProduct.productName} packaged and registered`
    });

    return newProduct;
  }

  // Purchase a batch and create downstream records
  purchaseBatch(batchId, manufacturer) {
    const batches = this.getBatches();
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return null;

    // Mark batch as purchased
    batch.status = 'Purchased';
    batch.purchasedBy = manufacturer?.name || manufacturer?.companyName || 'Demo Manufacturer';
    batch.purchasedAt = new Date().toISOString();
    this.setData('batches', batches);

    // Blockchain tx: transfer/ownership
    this.addBlockchainTransaction({
      type: 'transfer',
      from: batch.farmerName || 'Farmer',
      to: batch.purchasedBy,
      batchId: batch.id,
      value: '—',
      timestamp: new Date().toISOString(),
      description: `Batch ${batch.id} purchased by ${batch.purchasedBy}`
    });

    // Create manufacturing record and product
    const mfg = this.createManufacturingRecordFromBatch(batch, manufacturer);
    const product = this.createProductFromManufacturing(mfg);

    // Update analytics
    this.updateAnalytics();

    return { batch, manufacturingRecord: mfg, product };
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

  // Manufacturing Records management
  getManufacturingRecords(manufacturerId = null) {
    const records = this.getData('manufacturingRecords') || [];
    return manufacturerId ? records.filter(record => record.manufacturerId === manufacturerId) : records;
  }

  addManufacturingRecord(record) {
    const records = this.getManufacturingRecords();
    const newRecord = {
      ...record,
      id: record.id || `MFG-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    records.push(newRecord);
    return this.setData('manufacturingRecords', records);
  }

  updateManufacturingRecord(recordId, updates) {
    const records = this.getManufacturingRecords();
    const index = records.findIndex(record => record.id === recordId);
    if (index !== -1) {
      records[index] = {
        ...records[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.setData('manufacturingRecords', records);
    }
    return false;
  }

  deleteManufacturingRecord(recordId) {
    const records = this.getManufacturingRecords();
    const filtered = records.filter(record => record.id !== recordId);
    return this.setData('manufacturingRecords', filtered);
  }

  // Get manufacturing record by batch ID
  getManufacturingRecordByBatchId(batchId) {
    const records = this.getManufacturingRecords();
    return records.find(record => record.batchId === batchId);
  }

  // Generate blockchain hash simulation
  generateBlockchainHash(data) {
    // Simple hash simulation using timestamp and data
    const timestamp = Date.now().toString();
    const dataString = JSON.stringify(data);
    let hash = '0x';
    
    // Create a pseudo-random hash based on data
    for (let i = 0; i < 40; i++) {
      const char = (timestamp.charCodeAt(i % timestamp.length) + 
                   dataString.charCodeAt(i % dataString.length) + i)
                   .toString(16).slice(-1);
      hash += char;
    }
    
    return hash;
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
    const manufacturingRecords = this.getManufacturingRecords();

    const batch = batches.find(b => b.id === batchId);
    if (!batch) return null;

    const relatedProducts = products.filter(p => p.batchId === batchId);
    const relatedVerifications = verifications.filter(v => v.batchId === batchId);
    const relatedManufacturing = manufacturingRecords.filter(r => r.batchId === batchId);

    return {
      batch,
      products: relatedProducts,
      verifications: relatedVerifications,
      manufacturingRecords: relatedManufacturing,
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
        ...(relatedManufacturing.map(record => ({
          stage: 'Manufacturing Process',
          date: record.processingDate,
          location: record.facilityName,
          responsible: record.manufacturerName,
          status: record.status,
          details: {
            process: record.process,
            qualityTestResult: record.qualityTestResult,
            expectedYield: record.expectedYield,
            actualYield: record.actualYield,
            blockchainHash: record.blockchainHash
          }
        }))),
        ...(relatedProducts.map(product => ({
          stage: 'Product Creation',
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
    const manufacturingRecords = this.getManufacturingRecords();

    const analytics = {
      lastUpdated: new Date().toISOString(),
      totalBatches: batches.length,
      totalProducts: products.length,
      totalVerifications: verifications.length,
      totalManufacturingRecords: manufacturingRecords.length,
      qualityScore: this.calculateQualityScore(batches),
      traceabilityRate: this.calculateTraceabilityRate(batches, products),
      farmersCount: new Set(batches.map(b => b.farmerId)).size,
      manufacturersCount: new Set([...products.map(p => p.manufacturerId), ...manufacturingRecords.map(r => r.manufacturerId)]).size,
      consumersCount: new Set(verifications.map(v => v.consumerId)).size,
      processedBatches: manufacturingRecords.length,
      averageProcessingTime: this.calculateAverageProcessingTime(manufacturingRecords)
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

  calculateAverageProcessingTime(manufacturingRecords) {
    if (manufacturingRecords.length === 0) return 0;
    
    const completedRecords = manufacturingRecords.filter(record => 
      record.processingDate && record.completionDate
    );
    
    if (completedRecords.length === 0) return 0;
    
    const totalProcessingTime = completedRecords.reduce((total, record) => {
      const startDate = new Date(record.processingDate);
      const endDate = new Date(record.completionDate);
      return total + (endDate - startDate);
    }, 0);
    
    // Return average processing time in days
    const averageMs = totalProcessingTime / completedRecords.length;
    return Math.round(averageMs / (1000 * 60 * 60 * 24));
  }

  // Consumer verification methods
  verifyProductById(productId) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return {
        success: false,
        message: 'Product not found. This may be a counterfeit product.',
        confidence: 0
      };
    }

    // Get related supply chain data
    const batch = this.getBatches().find(b => b.id === product.batchId);
    const manufacturingRecord = this.getManufacturingRecordByBatchId(product.batchId);
    const supplyChainJourney = this.getSupplyChainJourney(product.batchId);

    return {
      success: true,
      product,
      batch,
      manufacturingRecord,
      supplyChainJourney,
      confidence: 98.5,
      message: 'Product verified successfully'
    };
  }

  verifyBatchById(batchId) {
    const batches = this.getBatches();
    const batch = batches.find(b => b.id === batchId);
    
    if (!batch) {
      return {
        success: false,
        message: 'Batch not found in our database.',
        confidence: 0
      };
    }

    const manufacturingRecord = this.getManufacturingRecordByBatchId(batch.id);
    const supplyChainJourney = this.getSupplyChainJourney(batch.id);

    return {
      success: true,
      batch,
      manufacturingRecord,
      supplyChainJourney,
      confidence: 96.8,
      message: 'Batch verified successfully'
    };
  }

  verifyManufacturingById(manufacturingId) {
    const manufacturingRecords = this.getManufacturingRecords();
    const manufacturingRecord = manufacturingRecords.find(r => r.id === manufacturingId);
    
    if (!manufacturingRecord) {
      return {
        success: false,
        message: 'Manufacturing record not found in our database.',
        confidence: 0
      };
    }

    const batch = this.getBatches().find(b => b.id === manufacturingRecord.batchId);
    const supplyChainJourney = this.getSupplyChainJourney(manufacturingRecord.batchId);

    return {
      success: true,
      manufacturingRecord,
      batch,
      supplyChainJourney,
      confidence: 94.2,
      message: 'Manufacturing record verified successfully'
    };
  }

  // Generate QR code data for products
  generateProductQRCode(productId) {
    const product = this.getProducts().find(p => p.id === productId);
    if (!product) return null;

    return {
      type: 'product_verification',
      productId: product.id,
      batchId: product.batchId,
      productName: product.productName,
      manufacturerName: product.manufacturerName,
      expiryDate: product.expiryDate,
      qrCodeId: product.qrCode,
      timestamp: Date.now()
    };
  }

  // Get all available QR codes for testing
  getAllQRCodes() {
    const products = this.getProducts();
    const batches = this.getBatches();
    const manufacturingRecords = this.getManufacturingRecords();

    const qrCodes = [];

    // Product QR codes
    products.forEach(product => {
      qrCodes.push({
        id: product.qrCode || `QR_${product.id}`,
        type: 'product',
        targetId: product.id,
        data: {
          productId: product.id,
          batchId: product.batchId,
          productName: product.productName,
          manufacturerName: product.manufacturerName,
          expiryDate: product.expiryDate
        }
      });
    });

    // Batch QR codes
    batches.forEach(batch => {
      qrCodes.push({
        id: `QR_${batch.id}`,
        type: 'batch',
        targetId: batch.id,
        data: {
          batchId: batch.id,
          crop: batch.crop,
          farmerName: batch.farmerName,
          harvestDate: batch.harvestDate,
          location: batch.location
        }
      });
    });

    // Manufacturing QR codes
    manufacturingRecords.forEach(record => {
      qrCodes.push({
        id: `QR_${record.id}`,
        type: 'manufacturing',
        targetId: record.id,
        data: {
          manufacturingId: record.id,
          batchId: record.batchId,
          process: record.process,
          facilityName: record.facilityName,
          processingDate: record.processingDate
        }
      });
    });

    return qrCodes;
  }

  // Search products by various criteria
  searchProducts(query) {
    const products = this.getProducts();
    const searchTerm = query.toLowerCase();

    return products.filter(product => 
      product.productName.toLowerCase().includes(searchTerm) ||
      product.manufacturerName.toLowerCase().includes(searchTerm) ||
      product.id.toLowerCase().includes(searchTerm) ||
      product.batchId.toLowerCase().includes(searchTerm)
    );
  }

  // Blockchain transaction management
  getAllBlockchainTransactions() {
    return this.getData('blockchainTransactions') || [];
  }

  addBlockchainTransaction(transaction) {
    const transactions = this.getAllBlockchainTransactions();
    const newTransaction = {
      ...transaction,
      hash: transaction.hash || this.generateTransactionHash(transaction),
      timestamp: transaction.timestamp || new Date().toISOString(),
      blockNumber: transaction.blockNumber || this.getNextBlockNumber(),
      transactionIndex: transaction.transactionIndex || transactions.length,
      gasUsed: transaction.gasUsed || '21000',
      gasPrice: transaction.gasPrice || '20 gwei',
      nonce: transaction.nonce || Math.floor(Math.random() * 1000)
    };
    
    transactions.push(newTransaction);
    return this.setData('blockchainTransactions', transactions);
  }

  generateTransactionHash(transaction) {
    // Generate a realistic transaction hash based on transaction data
    const data = JSON.stringify({
      type: transaction.type,
      from: transaction.from,
      to: transaction.to,
      batchId: transaction.batchId,
      timestamp: Date.now(),
      random: Math.random()
    });
    
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      const char = (data.charCodeAt(i % data.length) + i)
        .toString(16).slice(-1);
      hash += char;
    }
    
    return hash;
  }

  getNextBlockNumber() {
    const transactions = this.getAllBlockchainTransactions();
    if (transactions.length === 0) return 10000;
    
    const maxBlock = Math.max(...transactions.map(t => t.blockNumber || 0));
    return maxBlock + Math.floor(Math.random() * 10) + 1;
  }

  searchBlockchainTransactions(query, filters = {}) {
    const transactions = this.getAllBlockchainTransactions();
    const searchTerm = query.toLowerCase();
    
    let filtered = transactions.filter(tx => {
      const matchesQuery = !searchTerm || 
        tx.hash?.toLowerCase().includes(searchTerm) ||
        tx.batchId?.toLowerCase().includes(searchTerm) ||
        tx.productId?.toLowerCase().includes(searchTerm) ||
        tx.from?.toLowerCase().includes(searchTerm) ||
        tx.to?.toLowerCase().includes(searchTerm) ||
        tx.type?.toLowerCase().includes(searchTerm) ||
        tx.description?.toLowerCase().includes(searchTerm);
      
      const matchesType = !filters.type || filters.type === 'all' || tx.type === filters.type;
      
      let matchesDate = true;
      if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        const txDate = new Date(tx.timestamp);
        
        switch (filters.dateRange) {
          case 'today':
            matchesDate = txDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = txDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = txDate >= monthAgo;
            break;
          default:
            break;
        }
      }
      
      return matchesQuery && matchesType && matchesDate;
    });
    
    // Sort by timestamp (most recent first)
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getBlockchainTransactionsByBatch(batchId) {
    const transactions = this.getAllBlockchainTransactions();
    return transactions.filter(tx => tx.batchId === batchId);
  }

  getBlockchainTransactionsByProduct(productId) {
    const transactions = this.getAllBlockchainTransactions();
    return transactions.filter(tx => tx.productId === productId);
  }

  getBlockchainStatistics() {
    const transactions = this.getAllBlockchainTransactions();
    const now = Date.now();
    
    const stats = {
      totalTransactions: transactions.length,
      transactionsByType: {},
      recentTransactions: 0,
      totalGasUsed: 0,
      averageGasPrice: 0,
      totalValue: 0,
      uniqueParticipants: new Set(),
      latestBlock: 0
    };
    
    transactions.forEach(tx => {
      // Count by type
      stats.transactionsByType[tx.type] = (stats.transactionsByType[tx.type] || 0) + 1;
      
      // Recent transactions (last 24 hours)
      const txTime = new Date(tx.timestamp).getTime();
      if (now - txTime < 24 * 60 * 60 * 1000) {
        stats.recentTransactions++;
      }
      
      // Gas statistics
      const gasUsed = parseInt(tx.gasUsed?.replace(/[^0-9]/g, '') || '0');
      stats.totalGasUsed += gasUsed;
      
      // Value statistics
      const value = parseFloat(tx.value?.replace(/[^0-9.]/g, '') || '0');
      stats.totalValue += value;
      
      // Unique participants
      if (tx.from) stats.uniqueParticipants.add(tx.from);
      if (tx.to) stats.uniqueParticipants.add(tx.to);
      
      // Latest block
      if (tx.blockNumber > stats.latestBlock) {
        stats.latestBlock = tx.blockNumber;
      }
    });
    
    stats.uniqueParticipants = stats.uniqueParticipants.size;
    stats.averageGasPrice = transactions.length > 0 ? 
      Math.round(stats.totalGasUsed / transactions.length) : 0;
    
    return stats;
  }

  // Auto-generate blockchain transactions for existing data
  generateBlockchainTransactionsForExistingData() {
    const batches = this.getBatches();
    const products = this.getProducts();
    const manufacturingRecords = this.getManufacturingRecords();
    const verifications = this.getVerifications();
    
    const newTransactions = [];
    
    // Generate transactions for batches
    batches.forEach(batch => {
      const existingTx = this.getAllBlockchainTransactions()
        .find(tx => tx.batchId === batch.id && tx.type === 'batch_creation');
      
      if (!existingTx) {
        newTransactions.push({
          type: 'batch_creation',
          from: batch.farmerName || 'Farmer',
          to: 'AyurTrace Network',
          batchId: batch.id,
          value: '1 AYUR',
          timestamp: batch.createdAt,
          description: `${batch.crop} batch registered with quality grade ${batch.quality}`
        });
      }
    });
    
    // Generate transactions for manufacturing
    manufacturingRecords.forEach(record => {
      const existingTx = this.getAllBlockchainTransactions()
        .find(tx => tx.manufacturingId === record.id && tx.type === 'manufacturing');
      
      if (!existingTx) {
        newTransactions.push({
          type: 'manufacturing',
          from: record.manufacturerName || 'Manufacturer',
          to: 'AyurTrace Network',
          batchId: record.batchId,
          manufacturingId: record.id,
          value: '2 AYUR',
          timestamp: record.createdAt,
          description: `${record.process} process completed at ${record.facilityName}`
        });
      }
    });
    
    // Generate transactions for products
    products.forEach(product => {
      const existingTx = this.getAllBlockchainTransactions()
        .find(tx => tx.productId === product.id && tx.type === 'product_creation');
      
      if (!existingTx) {
        newTransactions.push({
          type: 'product_creation',
          from: product.manufacturerName || 'Manufacturer',
          to: 'AyurTrace Network',
          batchId: product.batchId,
          productId: product.id,
          value: '3 AYUR',
          timestamp: product.createdAt,
          description: `${product.productName} packaged and registered`
        });
      }
    });
    
    // Generate transactions for verifications
    verifications.forEach(verification => {
      const existingTx = this.getAllBlockchainTransactions()
        .find(tx => tx.hash?.includes(verification.id) && tx.type === 'verification');
      
      if (!existingTx) {
        newTransactions.push({
          type: 'verification',
          from: 'Consumer',
          to: 'AyurTrace Network',
          batchId: verification.batchId,
          productId: verification.productId,
          value: '0.1 AYUR',
          timestamp: verification.verificationDate,
          description: `Product verified by consumer in ${verification.location}`
        });
      }
    });
    
    // Add all new transactions
    newTransactions.forEach(tx => {
      this.addBlockchainTransaction(tx);
    });
    
    return newTransactions.length;
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
      // eslint-disable-next-line no-console
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Create singleton instance
const localStorageManager = new LocalStorageManager();

export default localStorageManager;
