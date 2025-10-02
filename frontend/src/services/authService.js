import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration response
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.success && response.token) {
        localStorage.setItem('ayurTrace_token', response.token);
        localStorage.setItem('ayurTrace_user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Login response with token and user data
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success && response.token) {
        localStorage.setItem('ayurTrace_token', response.token);
        localStorage.setItem('ayurTrace_user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('ayurTrace_token');
    localStorage.removeItem('ayurTrace_user');
    window.location.href = '/login';
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Update response
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/me', profileData);
      if (response.success && response.user) {
        localStorage.setItem('ayurTrace_user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Password change response
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      return await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete user account
   * @param {string} password - User password for confirmation
   * @returns {Promise} Account deletion response
   */
  deleteAccount: async (password) => {
    try {
      const response = await api.delete('/auth/me', {
        data: { password },
      });
      if (response.success) {
        authService.logout();
      }
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('ayurTrace_token');
    return !!token;
  },

  /**
   * Get stored user data
   * @returns {Object|null} User data or null
   */
  getCurrentUser: () => {
    const userData = localStorage.getItem('ayurTrace_user');
    return userData ? JSON.parse(userData) : null;
  },
};

export default authService;
