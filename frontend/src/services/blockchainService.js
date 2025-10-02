import api from './api';

/**
 * Blockchain Service
 * Handles blockchain-related API calls
 */

const blockchainService = {
  /**
   * Get all blockchain transactions
   * @param {Object} params - Query parameters (limit, offset, etc.)
   * @returns {Promise} List of transactions
   */
  getTransactions: async (params = {}) => {
    try {
      return await api.get('/blockchain/transactions', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get transaction by hash
   * @param {string} txHash - Transaction hash
   * @returns {Promise} Transaction details
   */
  getTransactionByHash: async (txHash) => {
    try {
      return await api.get(`/blockchain/transaction/${txHash}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get blockchain network status
   * @returns {Promise} Network status information
   */
  getNetworkStatus: async () => {
    try {
      return await api.get('/blockchain/status');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get batch blockchain history
   * @param {string} batchId - Batch ID
   * @returns {Promise} Complete blockchain history for batch
   */
  getBatchHistory: async (batchId) => {
    try {
      return await api.get(`/blockchain/history/${batchId}`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default blockchainService;
