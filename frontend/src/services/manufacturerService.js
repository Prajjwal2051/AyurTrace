import api from './api';

/**
 * Manufacturer Service
 * Handles all manufacturer-related API calls
 */

const manufacturerService = {
  /**
   * Get manufacturer dashboard stats
   * @returns {Promise} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      return await api.get('/manufacturer/dashboard');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get available batches for processing
   * @param {Object} filters - Optional filters (herbType, qualityGrade, etc.)
   * @returns {Promise} List of available batches
   */
  getAvailableBatches: async (filters = {}) => {
    try {
      return await api.get('/manufacturer/available-batches', { params: filters });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Process a batch
   * @param {string} batchId - Batch ID to process
   * @param {Object} processingData - Processing information
   * @returns {Promise} Processing response
   */
  processBatch: async (batchId, processingData) => {
    try {
      return await api.post(`/manufacturer/process-batch/${batchId}`, processingData);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all processed batches
   * @param {Object} filters - Optional filters
   * @returns {Promise} List of processed batches
   */
  getProcessedBatches: async (filters = {}) => {
    try {
      return await api.get('/manufacturer/processed-batches', { params: filters });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add quality test results
   * @param {string} batchId - Batch ID
   * @param {Object} testData - Quality test data
   * @returns {Promise} Test results response
   */
  addQualityTest: async (batchId, testData) => {
    try {
      return await api.post(`/manufacturer/quality-test/${batchId}`, testData);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Generate QR code for product
   * @param {string} batchId - Batch ID
   * @returns {Promise} QR code data
   */
  generateQRCode: async (batchId) => {
    try {
      return await api.post(`/manufacturer/generate-qr/${batchId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get manufacturer profile
   * @returns {Promise} Manufacturer profile data
   */
  getProfile: async () => {
    try {
      return await api.get('/manufacturer/profile');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get processing analytics
   * @param {Object} params - Query parameters
   * @returns {Promise} Analytics data
   */
  getAnalytics: async (params = {}) => {
    try {
      return await api.get('/manufacturer/analytics', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default manufacturerService;
