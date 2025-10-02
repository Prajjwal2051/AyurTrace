import api from './api';

/**
 * Consumer Service
 * Handles all consumer-related API calls
 */

const consumerService = {
  /**
   * Verify product by batch ID or QR code
   * @param {string} identifier - Batch ID or QR code data
   * @returns {Promise} Verification result with product journey
   */
  verifyProduct: async (identifier) => {
    try {
      return await api.get(`/consumer/verify/${identifier}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get product journey/supply chain details
   * @param {string} batchId - Batch ID
   * @returns {Promise} Complete product journey
   */
  getProductJourney: async (batchId) => {
    try {
      return await api.get(`/consumer/journey/${batchId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Search products
   * @param {Object} searchParams - Search criteria (herbType, farmerId, etc.)
   * @returns {Promise} Search results
   */
  searchProducts: async (searchParams) => {
    try {
      return await api.get('/consumer/search', { params: searchParams });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get consumer dashboard stats
   * @returns {Promise} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      return await api.get('/consumer/dashboard');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get verification history
   * @returns {Promise} List of previously verified products
   */
  getVerificationHistory: async () => {
    try {
      return await api.get('/consumer/history');
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default consumerService;
