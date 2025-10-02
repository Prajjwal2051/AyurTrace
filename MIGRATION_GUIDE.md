# Frontend API Service Migration Guide

## Overview

The frontend now has a complete, professional API service layer that centralizes all backend communication. This guide helps you migrate existing code to use the new service layer.

---

## 🎯 Benefits of Using the Service Layer

1. **Centralized Configuration** - One place to manage API URLs and headers
2. **Automatic Authentication** - Tokens automatically added to requests
3. **Error Handling** - Consistent error handling across the app
4. **Type Safety** - JSDoc comments for better IDE support
5. **Maintainability** - Easy to update and test
6. **Auto Redirect** - Automatic redirect on 401 Unauthorized

---

## 📁 Available Services

```
frontend/src/services/
├── api.js              - Base axios instance with interceptors
├── authService.js      - Authentication operations
├── farmerService.js    - Farmer-specific operations
├── manufacturerService.js  - Manufacturer operations
├── consumerService.js  - Product verification
├── blockchainService.js   - Blockchain interactions
└── analyticsService.js    - Analytics data
```

---

## 🔄 Migration Examples

### Example 1: Login

**❌ Before (Direct fetch/axios):**
```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

**✅ After (Using Service Layer):**
```javascript
import authService from '../services/authService';

const handleLogin = async (email, password) => {
  try {
    const response = await authService.login(email, password);
    // Token and user are automatically stored
    return response;
  } catch (error) {
    // Error is properly formatted
    console.error('Login failed:', error.message);
  }
};
```

### Example 2: Creating a Batch (Farmer)

**❌ Before:**
```javascript
const createBatch = async (batchData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/farmer/add-batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(batchData)
  });
  return await response.json();
};
```

**✅ After:**
```javascript
import farmerService from '../services/farmerService';

const createBatch = async (batchData) => {
  return await farmerService.createBatch(batchData);
};
```

### Example 3: Verifying Product (Consumer)

**❌ Before:**
```javascript
const verifyProduct = async (batchId) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/consumer/verify/${batchId}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Manual redirect handling
      window.location.href = '/login';
    }
    throw error;
  }
};
```

**✅ After:**
```javascript
import consumerService from '../services/consumerService';

const verifyProduct = async (batchId) => {
  // Automatic 401 handling and redirect
  return await consumerService.verifyProduct(batchId);
};
```

### Example 4: Getting Dashboard Stats

**❌ Before:**
```javascript
useEffect(() => {
  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/api/farmer/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setStats(data);
  };
  fetchStats();
}, []);
```

**✅ After:**
```javascript
import farmerService from '../services/farmerService';

useEffect(() => {
  const fetchStats = async () => {
    const data = await farmerService.getDashboardStats();
    setStats(data);
  };
  fetchStats();
}, []);
```

### Example 5: Uploading Images with FormData

**❌ Before:**
```javascript
const uploadImages = async (batchId, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:3001/api/farmer/batches/${batchId}/images`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    }
  );
  return await response.json();
};
```

**✅ After:**
```javascript
import farmerService from '../services/farmerService';

const uploadImages = async (batchId, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  return await farmerService.uploadBatchImages(batchId, formData);
};
```

---

## 🎨 React Component Examples

### Login Component

```javascript
import React, { useState } from 'react';
import authService from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      // Redirect handled automatically or via state
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### Farmer Dashboard Component

```javascript
import React, { useState, useEffect } from 'react';
import farmerService from '../services/farmerService';

const FarmerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, batchesData] = await Promise.all([
          farmerService.getDashboardStats(),
          farmerService.getBatches()
        ]);
        setStats(statsData);
        setBatches(batchesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Farmer Dashboard</h1>
      <div>Total Batches: {stats?.totalBatches}</div>
      <div>
        {batches.map(batch => (
          <div key={batch.id}>{batch.herbType}</div>
        ))}
      </div>
    </div>
  );
};
```

### Consumer Verification Component

```javascript
import React, { useState } from 'react';
import consumerService from '../services/consumerService';

const ProductVerification = () => {
  const [batchId, setBatchId] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      setError('');
      const result = await consumerService.verifyProduct(batchId);
      setProduct(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setProduct(null);
    }
  };

  return (
    <div>
      <input
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        placeholder="Enter Batch ID"
      />
      <button onClick={handleVerify}>Verify</button>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {product && (
        <div className="alert alert-success">
          <h3>Product Verified!</h3>
          <p>Herb: {product.herbType}</p>
          <p>Farmer: {product.farmerName}</p>
        </div>
      )}
    </div>
  );
};
```

---

## 🔧 Advanced Usage

### Custom Hooks

Create custom hooks for common operations:

```javascript
// hooks/useFarmerBatches.js
import { useState, useEffect } from 'react';
import farmerService from '../services/farmerService';

export const useFarmerBatches = (filters = {}) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await farmerService.getBatches(filters);
        setBatches(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, [JSON.stringify(filters)]);

  return { batches, loading, error };
};

// Usage in component
const MyComponent = () => {
  const { batches, loading, error } = useFarmerBatches({ status: 'active' });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render batches */}</div>;
};
```

### Error Handling with Toast Notifications

```javascript
import { toast } from 'react-toastify';
import farmerService from '../services/farmerService';

const createBatch = async (batchData) => {
  try {
    const result = await farmerService.createBatch(batchData);
    toast.success('Batch created successfully!');
    return result;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create batch');
    throw error;
  }
};
```

---

## 📝 Service API Reference

### authService

| Method | Parameters | Description |
|--------|-----------|-------------|
| `login(email, password)` | email, password | Authenticate user |
| `register(userData)` | userData object | Register new user |
| `logout()` | - | Clear auth data and redirect |
| `getProfile()` | - | Get current user profile |
| `updateProfile(data)` | profile data | Update user profile |
| `changePassword(current, new)` | passwords | Change password |
| `isAuthenticated()` | - | Check if user is logged in |
| `getCurrentUser()` | - | Get stored user data |

### farmerService

| Method | Parameters | Description |
|--------|-----------|-------------|
| `getDashboardStats()` | - | Get dashboard statistics |
| `createBatch(data)` | batch data | Create new herb batch |
| `getBatches(filters)` | optional filters | Get all batches |
| `getBatchDetails(id)` | batch ID | Get single batch |
| `updateBatch(id, data)` | batch ID, data | Update batch |
| `uploadBatchImages(id, formData)` | batch ID, FormData | Upload images |
| `getAnalytics(params)` | params | Get analytics data |

### manufacturerService

| Method | Parameters | Description |
|--------|-----------|-------------|
| `getDashboardStats()` | - | Get dashboard stats |
| `getAvailableBatches(filters)` | filters | Get processable batches |
| `processBatch(id, data)` | batch ID, process data | Process a batch |
| `addQualityTest(id, data)` | batch ID, test data | Add quality test |
| `generateQRCode(id)` | batch ID | Generate QR code |

### consumerService

| Method | Parameters | Description |
|--------|-----------|-------------|
| `verifyProduct(identifier)` | batch ID or QR | Verify product authenticity |
| `getProductJourney(id)` | batch ID | Get supply chain journey |
| `searchProducts(params)` | search params | Search products |
| `getDashboardStats()` | - | Get dashboard stats |

---

## ✅ Migration Checklist

- [ ] Import appropriate service module
- [ ] Remove direct fetch/axios calls
- [ ] Remove manual token handling
- [ ] Remove manual Authorization header setup
- [ ] Simplify error handling (401 handled automatically)
- [ ] Test all API calls
- [ ] Update tests to mock services

---

## 🆘 Troubleshooting

### Issue: 401 Unauthorized
**Cause**: Token expired or invalid  
**Solution**: The service automatically redirects to login on 401

### Issue: CORS Error
**Cause**: API URL misconfigured  
**Solution**: Check `REACT_APP_API_URL` in `.env`

### Issue: Network Error
**Cause**: Backend not running  
**Solution**: Start backend server on port 3001

---

## 📚 Additional Resources

- See `frontend/src/services/` for complete API
- Check JSDoc comments for detailed parameter information
- Review existing components for usage examples

---

**Last Updated**: October 2, 2025
