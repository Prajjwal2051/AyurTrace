import api from './api';

/**
 * Farmer Service
 * Handles all farmer-related API calls
 */

const farmerService = {
  /**
   * Get farmer dashboard stats
   * @returns {Promise} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      return await api.get('/farmer/dashboard');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create new herb batch
   * @param {Object} batchData - Batch information
   * @returns {Promise} Created batch response
   */
  createBatch: async (batchData) => {
    try {
      return await api.post('/farmer/add-batch', batchData);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all farmer's batches
   * @param {Object} filters - Optional filters (status, herbType, etc.)
   * @returns {Promise} List of batches
   */
  getBatches: async (filters = {}) => {
    try {
      return await api.get('/farmer/batches', { params: filters });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get specific batch details
   * @param {string} batchId - Batch ID
   * @returns {Promise} Batch details
   */
  getBatchDetails: async (batchId) => {
    try {
      return await api.get(`/farmer/batches/${batchId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update batch information
   * @param {string} batchId - Batch ID
   * @param {Object} updateData - Data to update
   * @returns {Promise} Updated batch
   */
  updateBatch: async (batchId, updateData) => {
    try {
      return await api.put(`/farmer/batches/${batchId}`, updateData);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Upload batch images
   * @param {string} batchId - Batch ID
   * @param {FormData} formData - Form data with images
   * @returns {Promise} Upload response
   */
  uploadBatchImages: async (batchId, formData) => {
    try {
      return await api.post(`/farmer/batches/${batchId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get farmer profile
   * @returns {Promise} Farmer profile data
   */
  getProfile: async () => {
    try {
      return await api.get('/farmer/profile');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get harvest analytics
   * @param {Object} params - Query parameters (dateRange, herbType, etc.)
   * @returns {Promise} Analytics data
   */
  getAnalytics: async (params = {}) => {
    try {
      return await api.get('/farmer/analytics', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default farmerService;
