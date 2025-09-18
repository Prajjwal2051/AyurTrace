const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const herbBatchSchema = new mongoose.Schema({
  // Unique Identifiers
  batchId: {
    type: String,
    unique: true,
    default: () => `BATCH_${Date.now()}_${uuidv4().slice(-4).toUpperCase()}`
  },
  
  blockchainTxId: String, // Transaction ID on blockchain
  blockchainBlock: String, // Block number/hash where transaction is stored
  
  // Basic Herb Information
  herbType: {
    type: String,
    required: [true, 'Herb type is required'],
    enum: ['Ashwagandha', 'Brahmi', 'Tulsi', 'Neem', 'Turmeric', 'Amla']
  },
  
  herbVariety: String, // Specific variety/strain
  
  quantity: {
    amount: {
      type: Number,
      required: [true, 'Quantity amount is required'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Quantity unit is required'],
      enum: ['kg', 'g', 'tons', 'pieces'],
      default: 'kg'
    }
  },
  
  // Farmer Information
  farmerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required']
  },
  
  farmerInfo: {
    name: String,
    farmName: String,
    licenseNumber: String,
    contactNumber: String
  },
  
  // Location and Harvest Details
  harvestLocation: {
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Harvest latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        required: [true, 'Harvest longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    },
    address: {
      village: String,
      district: String,
      state: String,
      country: { type: String, default: 'India' },
      pincode: String
    },
    altitude: Number,
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'alluvial', 'red', 'black']
    }
  },
  
  // Harvest Information
  harvestDate: {
    type: Date,
    required: [true, 'Harvest date is required']
  },
  
  harvestSeason: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid', 'perennial'],
    required: true
  },
  
  weatherConditions: {
    temperature: Number, // in Celsius
    humidity: Number, // percentage
    rainfall: Number, // in mm
    sunlight: Number // hours
  },
  
  // Quality Information
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: [true, 'Quality grade is required']
  },
  
  qualityParameters: {
    moisture: Number, // percentage
    purity: Number, // percentage
    activeCompounds: [{
      name: String,
      value: Number,
      unit: String
    }],
    contaminants: [{
      type: String,
      level: Number,
      unit: String,
      acceptable: Boolean
    }]
  },
  
  // Images and Documentation
  images: {
    harvest: [String], // URLs of harvest images
    plant: [String], // URLs of plant images
    location: [String], // URLs of location images
    quality: [String] // URLs of quality test images
  },
  
  documents: [{
    type: {
      type: String,
      enum: ['certificate', 'test_report', 'license', 'invoice']
    },
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Processing and Manufacturing
  processingSteps: [{
    stepId: { type: String, default: uuidv4 },
    step: {
      type: String,
      enum: ['drying', 'grinding', 'extraction', 'purification', 'packaging', 'quality_testing']
    },
    description: String,
    startTime: Date,
    endTime: Date,
    duration: Number, // in minutes
    facility: {
      name: String,
      location: String,
      licenseNumber: String
    },
    operator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    operatorName: String,
    parameters: {
      temperature: Number,
      pressure: Number,
      duration: Number,
      humidity: Number
    },
    inputQuantity: {
      amount: Number,
      unit: String
    },
    outputQuantity: {
      amount: Number,
      unit: String
    },
    yield: Number, // percentage
    equipment: [String],
    notes: String,
    images: [String],
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Quality Tests
  qualityTests: [{
    testId: { type: String, default: uuidv4 },
    testType: {
      type: String,
      enum: ['chemical', 'microbiological', 'physical', 'organoleptic', 'heavy_metals', 'pesticides']
    },
    testDate: { type: Date, default: Date.now },
    laboratory: {
      name: String,
      accreditation: String,
      location: String
    },
    parameters: [{
      name: String,
      value: mongoose.Schema.Types.Mixed,
      unit: String,
      specification: String,
      result: {
        type: String,
        enum: ['pass', 'fail', 'borderline']
      }
    }],
    overallResult: {
      type: String,
      enum: ['pass', 'fail'],
      required: true
    },
    certificate: {
      number: String,
      url: String,
      validUntil: Date
    },
    testedBy: String,
    notes: String
  }],
  
  // Ownership and Transfer
  currentOwner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  
  ownerType: {
    type: String,
    enum: ['farmer', 'manufacturer', 'distributor', 'retailer'],
    required: true
  },
  
  ownershipHistory: [{
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    fromType: String,
    toType: String,
    transferDate: { type: Date, default: Date.now },
    transferReason: String,
    price: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    invoice: String,
    transferId: { type: String, default: uuidv4 },
    notes: String
  }],
  
  // Product Information (after processing)
  productDetails: {
    productId: String,
    productName: String,
    productType: {
      type: String,
      enum: ['raw_herb', 'powder', 'extract', 'oil', 'capsule', 'tablet', 'syrup']
    },
    brand: String,
    manufacturer: String,
    batchNumber: String,
    manufacturingDate: Date,
    expiryDate: Date,
    packaging: {
      type: String,
      material: String,
      weight: Number,
      dimensions: String
    },
    labeling: {
      ingredients: [String],
      dosage: String,
      instructions: String,
      warnings: String
    }
  },
  
  // QR Code and Verification
  qrCode: {
    data: String,
    imageUrl: String,
    generatedAt: Date,
    verificationUrl: String
  },
  
  verifications: [{
    verificationId: { type: String, default: uuidv4 },
    verifiedAt: { type: Date, default: Date.now },
    verifiedBy: String, // Consumer/scanner identifier
    location: {
      latitude: Number,
      longitude: Number
    },
    deviceInfo: String,
    ipAddress: String,
    result: {
      type: String,
      enum: ['authentic', 'suspicious', 'counterfeit'],
      default: 'authentic'
    }
  }],
  
  // Status and Lifecycle
  status: {
    type: String,
    enum: ['harvested', 'in_transit', 'processing', 'quality_testing', 'approved', 'rejected', 'packaged', 'shipped', 'delivered', 'recalled'],
    required: true,
    default: 'harvested'
  },
  
  lifecycle: [{
    stage: String,
    timestamp: { type: Date, default: Date.now },
    location: String,
    operator: String,
    notes: String
  }],
  
  // Compliance and Certifications
  compliance: {
    ayushApproved: { type: Boolean, default: false },
    organicCertified: { type: Boolean, default: false },
    gmpCompliant: { type: Boolean, default: false },
    certifications: [{
      type: String,
      number: String,
      issuedBy: String,
      validUntil: Date
    }]
  },
  
  // Analytics and Tracking
  analytics: {
    views: { type: Number, default: 0 },
    scans: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    lastViewed: Date,
    popularLocations: [{
      location: String,
      count: Number
    }]
  },
  
  // Seasonal and Environmental Data
  environmentalData: {
    seasonality: {
      isSeasonallyAppropriate: Boolean,
      expectedSeason: [String],
      actualSeason: String
    },
    climateData: {
      avgTemperature: Number,
      totalRainfall: Number,
      soilPh: Number,
      organicMatter: Number
    }
  },
  
  // Metadata
  tags: [String],
  notes: String,
  isActive: { type: Boolean, default: true },
  
  // GDPR and Privacy
  dataRetention: {
    deleteAfter: Date,
    reason: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
herbBatchSchema.index({ batchId: 1 });
herbBatchSchema.index({ farmerId: 1 });
herbBatchSchema.index({ herbType: 1 });
herbBatchSchema.index({ harvestDate: -1 });
herbBatchSchema.index({ status: 1 });
herbBatchSchema.index({ currentOwner: 1 });
herbBatchSchema.index({ 'harvestLocation.coordinates': '2dsphere' });
herbBatchSchema.index({ createdAt: -1 });
herbBatchSchema.index({ 'blockchainTxId': 1 });

// Virtual for age of batch
herbBatchSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.harvestDate.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for processing duration
herbBatchSchema.virtual('totalProcessingTime').get(function() {
  if (!this.processingSteps.length) return 0;
  
  return this.processingSteps.reduce((total, step) => {
    return total + (step.duration || 0);
  }, 0);
});

// Virtual for yield efficiency
herbBatchSchema.virtual('yieldEfficiency').get(function() {
  if (!this.processingSteps.length) return null;
  
  const lastStep = this.processingSteps[this.processingSteps.length - 1];
  const firstStep = this.processingSteps[0];
  
  if (lastStep.outputQuantity && firstStep.inputQuantity) {
    return (lastStep.outputQuantity.amount / firstStep.inputQuantity.amount) * 100;
  }
  
  return null;
});

// Static method to find batches by region
herbBatchSchema.statics.findByRegion = function(center, radius) {
  return this.find({
    'harvestLocation.coordinates': {
      $geoWithin: {
        $centerSphere: [[center.longitude, center.latitude], radius / 6371]
      }
    }
  });
};

// Static method to get harvest statistics
herbBatchSchema.statics.getHarvestStats = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: {
          herbType: '$herbType',
          month: { $month: '$harvestDate' },
          year: { $year: '$harvestDate' }
        },
        totalQuantity: { $sum: '$quantity.amount' },
        averageGrade: { $avg: { $cond: [
          { $eq: ['$qualityGrade', 'A'] }, 3,
          { $cond: [{ $eq: ['$qualityGrade', 'B'] }, 2, 1] }
        ]}},
        batchCount: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }
  ];
  
  return await this.aggregate(pipeline);
};

// Instance method to add processing step
herbBatchSchema.methods.addProcessingStep = function(stepData) {
  this.processingSteps.push({
    ...stepData,
    timestamp: new Date()
  });
  
  // Update status based on step
  if (stepData.step === 'packaging') {
    this.status = 'packaged';
  } else {
    this.status = 'processing';
  }
  
  // Add to lifecycle
  this.lifecycle.push({
    stage: stepData.step,
    timestamp: new Date(),
    location: stepData.facility?.name,
    operator: stepData.operatorName,
    notes: stepData.notes
  });
};

// Instance method to add quality test
herbBatchSchema.methods.addQualityTest = function(testData) {
  this.qualityTests.push({
    ...testData,
    testDate: new Date()
  });
  
  // Update status based on test result
  if (testData.overallResult === 'pass') {
    this.status = 'approved';
  } else {
    this.status = 'rejected';
  }
  
  // Add to lifecycle
  this.lifecycle.push({
    stage: 'quality_testing',
    timestamp: new Date(),
    location: testData.laboratory?.name,
    operator: testData.testedBy,
    notes: `${testData.testType} test: ${testData.overallResult}`
  });
};

// Instance method to transfer ownership
herbBatchSchema.methods.transferOwnership = function(newOwner, transferData) {
  this.ownershipHistory.push({
    from: this.currentOwner,
    fromType: this.ownerType,
    to: newOwner,
    toType: transferData.toType,
    transferDate: new Date(),
    ...transferData
  });
  
  this.currentOwner = newOwner;
  this.ownerType = transferData.toType;
  this.status = 'in_transit';
  
  // Add to lifecycle
  this.lifecycle.push({
    stage: 'ownership_transfer',
    timestamp: new Date(),
    operator: transferData.transferredBy,
    notes: `Transferred to ${transferData.toType}`
  });
};

// Instance method to generate QR code
herbBatchSchema.methods.generateQRCode = function(baseUrl = 'https://ayurtrace.com') {
  const qrData = {
    batchId: this.batchId,
    herbType: this.herbType,
    harvestDate: this.harvestDate,
    verificationUrl: `${baseUrl}/verify/${this.batchId}`
  };
  
  this.qrCode = {
    data: JSON.stringify(qrData),
    generatedAt: new Date(),
    verificationUrl: qrData.verificationUrl
  };
  
  return qrData;
};

// Instance method to record verification
herbBatchSchema.methods.recordVerification = function(verificationData) {
  this.verifications.push({
    ...verificationData,
    verifiedAt: new Date()
  });
  
  this.analytics.scans += 1;
  this.analytics.lastViewed = new Date();
  
  // Track popular locations
  if (verificationData.location) {
    const locationStr = `${verificationData.location.latitude},${verificationData.location.longitude}`;
    const existingLocation = this.analytics.popularLocations.find(
      loc => loc.location === locationStr
    );
    
    if (existingLocation) {
      existingLocation.count += 1;
    } else {
      this.analytics.popularLocations.push({
        location: locationStr,
        count: 1
      });
    }
  }
};

// Pre-save middleware
herbBatchSchema.pre('save', function(next) {
  // Validate seasonal appropriateness
  if (this.isModified('harvestDate') || this.isNew) {
    const month = this.harvestDate.getMonth() + 1;
    const seasonalChart = {
      'Ashwagandha': [10, 11, 12, 1, 2, 3],
      'Brahmi': [6, 7, 8, 9, 10, 11],
      'Tulsi': [1, 2, 3, 4, 10, 11, 12],
      'Neem': [1, 2, 3, 4, 5, 6],
      'Turmeric': [1, 2, 3, 4, 12],
      'Amla': [11, 12, 1, 2]
    };
    
    const validMonths = seasonalChart[this.herbType] || [];
    this.environmentalData = this.environmentalData || {};
    this.environmentalData.seasonality = {
      isSeasonallyAppropriate: validMonths.includes(month),
      expectedSeason: seasonalChart[this.herbType],
      actualSeason: month
    };
  }
  
  next();
});

const HerbBatch = mongoose.model('HerbBatch', herbBatchSchema);

module.exports = HerbBatch;
