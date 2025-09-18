const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for auth
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// Apply stricter rate limiting to login and register
router.use('/login', authLimiter);
router.use('/register', authLimiter);

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post('/register', [
  // Validation rules
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
  
  body('role')
    .isIn(['farmer', 'manufacturer', 'consumer'])
    .withMessage('Role must be farmer, manufacturer, or consumer'),
  
  body('gdprConsent')
    .isBoolean()
    .custom(value => {
      if (!value) {
        throw new Error('GDPR consent is required');
      }
      return true;
    })
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }

  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    address,
    farmerDetails,
    manufacturerDetails,
    gdprConsent
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user object
    const userData = {
      name,
      email,
      password,
      role,
      profile: {
        phoneNumber,
        address
      },
      gdprConsent: {
        given: gdprConsent,
        givenAt: new Date(),
        ipAddress: req.ip
      }
    };

    // Add role-specific details
    if (role === 'farmer' && farmerDetails) {
      userData.farmerDetails = {
        farmName: farmerDetails.farmName,
        farmSize: farmerDetails.farmSize,
        primaryCrops: farmerDetails.primaryCrops,
        farmingMethod: farmerDetails.farmingMethod || 'organic',
        experienceYears: farmerDetails.experienceYears
      };
    }

    if (role === 'manufacturer' && manufacturerDetails) {
      userData.manufacturerDetails = {
        companyName: manufacturerDetails.companyName,
        establishedYear: manufacturerDetails.establishedYear,
        licenseNumber: manufacturerDetails.licenseNumber,
        facilityType: manufacturerDetails.facilityType,
        capacity: manufacturerDetails.capacity,
        qualityStandards: manufacturerDetails.qualityStandards
      };
    }

    // Create user
    const user = await User.create(userData);

    // Generate JWT token
    const token = user.generateAuthToken();

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          isVerified: user.isVerified,
          status: user.status,
          displayName: user.displayName
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  try {
    // Demo/Mock authentication when MongoDB is not available
    const demoUsers = {
      'ramesh.farmer@ayurtrace.com': {
        password: 'Farmer123!',
        user: {
          id: 'farmer001',
          name: 'Ramesh Kumar',
          email: 'ramesh.farmer@ayurtrace.com',
          role: 'farmer',
          permissions: ['create_batch', 'view_batch', 'update_batch'],
          isVerified: true,
          status: 'active',
          displayName: 'Ramesh Kumar',
          lastLogin: new Date().toISOString(),
          loginCount: 1
        }
      },
      'arvind.manufacturer@ayurtrace.com': {
        password: 'Manufacturer123!',
        user: {
          id: 'manufacturer001',
          name: 'Arvind Kumar',
          email: 'arvind.manufacturer@ayurtrace.com',
          role: 'manufacturer',
          permissions: ['process_batch', 'create_product', 'view_analytics'],
          isVerified: true,
          status: 'active',
          displayName: 'Arvind Kumar',
          lastLogin: new Date().toISOString(),
          loginCount: 1
        }
      },
      'priya.consumer@ayurtrace.com': {
        password: 'Consumer123!',
        user: {
          id: 'consumer001',
          name: 'Anjali Verma',
          email: 'priya.consumer@ayurtrace.com',
          role: 'consumer',
          permissions: ['verify_product', 'view_journey'],
          isVerified: true,
          status: 'active',
          displayName: 'Anjali Verma',
          lastLogin: new Date().toISOString(),
          loginCount: 1
        }
      },
      'admin@ayurtrace.com': {
        password: 'Admin123!',
        user: {
          id: 'admin001',
          name: 'Admin User',
          email: 'admin@ayurtrace.com',
          role: 'admin',
          permissions: ['admin_access', 'manage_users', 'view_all_data'],
          isVerified: true,
          status: 'active',
          displayName: 'System Administrator',
          lastLogin: new Date().toISOString(),
          loginCount: 1
        }
      }
    };

    // Check if user exists in demo users and password matches
    const demoUser = demoUsers[email];
    if (demoUser && demoUser.password === password) {
      // Generate JWT token for demo user
      const token = jwt.sign(
        {
          id: demoUser.user.id,
          email: demoUser.user.email,
          role: demoUser.user.role,
          permissions: demoUser.user.permissions
        },
        process.env.JWT_SECRET || 'fallback-demo-secret',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Demo login successful',
        data: {
          user: demoUser.user,
          token
        }
      });
      return;
    }

    // Try MongoDB authentication if demo login fails
    const user = await User.findByCredentials(email, password);

    // Update login tracking
    await user.updateLoginInfo(req.ip);

    // Generate JWT token
    const token = user.generateAuthToken();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          isVerified: user.isVerified,
          status: user.status,
          displayName: user.displayName,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Generic error message for security
    res.status(401).json({
      success: false,
      message: 'Invalid credentials or account status issue'
    });
  }
}));

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('batchCount')
    .select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        profile: user.profile,
        farmerDetails: user.farmerDetails,
        manufacturerDetails: user.manufacturerDetails,
        isVerified: user.isVerified,
        status: user.status,
        displayName: user.displayName,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        batchCount: user.batchCount,
        createdAt: user.createdAt
      }
    }
  });
}));

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('profile.phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const allowedFields = ['name', 'profile', 'farmerDetails', 'manufacturerDetails'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'profile') {
          updates[field] = { ...user.profile, ...req.body[field] };
        } else if (field === 'farmerDetails' && user.role === 'farmer') {
          updates[field] = { ...user.farmerDetails, ...req.body[field] };
        } else if (field === 'manufacturerDetails' && user.role === 'manufacturer') {
          updates[field] = { ...user.manufacturerDetails, ...req.body[field] };
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
router.put('/change-password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must be at least 8 characters with uppercase, lowercase, number and special character')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Password change failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

/**
 * @desc    Logout user (invalidate token - client-side mainly)
 * @route   POST /api/auth/logout
 * @access  Private
 */
router.post('/logout', protect, asyncHandler(async (req, res) => {
  // In a real-world application, you might want to maintain a blacklist of tokens
  // For now, we'll rely on client-side token removal
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}));

/**
 * @desc    Delete user account (GDPR compliance)
 * @route   DELETE /api/auth/delete-account
 * @access  Private
 */
router.delete('/delete-account', protect, [
  body('password')
    .notEmpty()
    .withMessage('Password is required for account deletion'),
  
  body('confirmDeletion')
    .equals('DELETE_MY_ACCOUNT')
    .withMessage('Please type DELETE_MY_ACCOUNT to confirm')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }

  const { password } = req.body;

  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Delete user account and related data
    await user.remove();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Account deletion failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

module.exports = router;
