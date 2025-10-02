import api from './api';

/**
 * Analytics Service
 * Handles analytics-related API calls
 */

const analyticsService = {
  /**
   * Get overall system analytics
   * @param {Object} params - Query parameters (dateRange, etc.)
   * @returns {Promise} System analytics data
   */
  getSystemAnalytics: async (params = {}) => {
    try {
      return await api.get('/analytics/system', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get supply chain analytics
   * @param {Object} params - Query parameters
   * @returns {Promise} Supply chain metrics
   */
  getSupplyChainAnalytics: async (params = {}) => {
    try {
      return await api.get('/analytics/supply-chain', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get quality analytics
   * @param {Object} params - Query parameters
   * @returns {Promise} Quality metrics
   */
  getQualityAnalytics: async (params = {}) => {
    try {
      return await api.get('/analytics/quality', { params });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Export analytics data
   * @param {string} format - Export format (csv, json, pdf)
   * @param {Object} params - Export parameters
   * @returns {Promise} Export file
   */
  exportAnalytics: async (format, params = {}) => {
    try {
      return await api.get(`/analytics/export/${format}`, {
        params,
        responseType: 'blob',
      });
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default analyticsService;
