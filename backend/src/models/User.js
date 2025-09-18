const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Role and Permissions
  role: {
    type: String,
    enum: ['farmer', 'manufacturer', 'consumer', 'admin', 'gov_admin', 'tech_admin'],
    required: [true, 'Role is required'],
    default: 'consumer'
  },
  
  permissions: [{
    type: String,
    enum: [
      'create_batch', 'update_batch', 'view_batch', 'delete_batch',
      'process_herb', 'quality_test', 'transfer_ownership',
      'view_analytics', 'system_admin', 'user_management',
      'blockchain_admin', 'verify_product'
    ]
  }],
  
  // Profile Information
  profile: {
    avatar: String,
    phoneNumber: {
      type: String,
      match: [/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'India' },
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    website: String,
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String
    }
  },
  
  // Farmer Specific Information
  farmerDetails: {
    farmId: {
      type: String,
      unique: true,
      sparse: true // Only enforce uniqueness if present
    },
    farmName: String,
    farmSize: Number, // in acres
    primaryCrops: [{
      type: String,
      enum: ['Ashwagandha', 'Brahmi', 'Tulsi', 'Neem', 'Turmeric', 'Amla']
    }],
    farmingMethod: {
      type: String,
      enum: ['organic', 'conventional', 'biodynamic'],
      default: 'organic'
    },
    certifications: [{
      name: String,
      issuedBy: String,
      validUntil: Date,
      certificateNumber: String
    }],
    experienceYears: Number,
    farmImages: [String]
  },
  
  // Manufacturer Specific Information
  manufacturerDetails: {
    companyId: {
      type: String,
      unique: true,
      sparse: true
    },
    companyName: String,
    establishedYear: Number,
    licenseNumber: String,
    facilityType: {
      type: String,
      enum: ['processing', 'packaging', 'extraction', 'full_facility']
    },
    capacity: {
      daily: Number,
      monthly: Number,
      unit: { type: String, default: 'kg' }
    },
    ayushLicense: {
      number: String,
      validUntil: Date,
      issuedBy: String
    },
    qualityStandards: [{
      type: String,
      enum: ['GMP', 'ISO', 'AYUSH', 'WHO-GMP', 'FDA']
    }],
    facilityImages: [String]
  },
  
  // Verification and Status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['aadhar', 'pan', 'license', 'certificate', 'land_record']
    },
    documentUrl: String,
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending', 'inactive'],
    default: 'pending'
  },
  
  // Activity Tracking
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  
  // GDPR Compliance
  gdprConsent: {
    given: { type: Boolean, default: false },
    givenAt: Date,
    ipAddress: String
  },
  
  dataRetention: {
    deleteAfter: Date,
    reason: String
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  
  notes: String // Admin notes
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'farmerDetails.farmId': 1 });
userSchema.index({ 'manufacturerDetails.companyId': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'profile.address.coordinates': '2dsphere' });

// Virtual for full name with title based on role
userSchema.virtual('displayName').get(function() {
  const titles = {
    farmer: 'Farmer',
    manufacturer: 'Manufacturer',
    admin: 'Admin',
    gov_admin: 'Government Admin',
    tech_admin: 'Technical Admin'
  };
  
  const title = titles[this.role] || '';
  return title ? `${title} ${this.name}` : this.name;
});

// Virtual for batch count (populated separately)
userSchema.virtual('batchCount', {
  ref: 'HerbBatch',
  localField: '_id',
  foreignField: 'farmerId',
  count: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to set permissions based on role
userSchema.pre('save', function(next) {
  const rolePermissions = {
    farmer: ['create_batch', 'update_batch', 'view_batch', 'verify_product'],
    manufacturer: ['process_herb', 'quality_test', 'transfer_ownership', 'view_batch', 'verify_product'],
    consumer: ['verify_product', 'view_batch'],
    admin: ['view_analytics', 'user_management', 'system_admin'],
    gov_admin: ['view_analytics', 'user_management', 'system_admin', 'blockchain_admin'],
    tech_admin: ['system_admin', 'blockchain_admin']
  };
  
  if (this.isModified('role') || this.isNew) {
    this.permissions = rolePermissions[this.role] || [];
  }
  
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role,
      permissions: this.permissions
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d' 
    }
  );
};

// Instance method to check permissions
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Instance method to update login tracking
userSchema.methods.updateLoginInfo = async function(ipAddress) {
  this.lastLogin = new Date();
  this.loginCount += 1;
  
  // Update GDPR consent IP if not set
  if (!this.gdprConsent.ipAddress) {
    this.gdprConsent.ipAddress = ipAddress;
  }
  
  return await this.save({ validateBeforeSave: false });
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  
  if (user.status !== 'active') {
    throw new Error('Account is not active. Please contact support.');
  }
  
  return user;
};

// Static method to get farmers in a region
userSchema.statics.getFarmersInRegion = function(center, radius) {
  return this.find({
    role: 'farmer',
    'profile.address.coordinates': {
      $geoWithin: {
        $centerSphere: [[center.longitude, center.latitude], radius / 6371] // radius in km
      }
    }
  });
};

// Pre-remove middleware to clean up related data
userSchema.pre('remove', async function(next) {
  // Remove user's batches (if farmer)
  if (this.role === 'farmer') {
    await this.model('HerbBatch').deleteMany({ farmerId: this._id });
  }
  
  // Remove user's transactions
  await this.model('Transaction').deleteMany({ userId: this._id });
  
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
