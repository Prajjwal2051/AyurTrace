import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Demo users for authentication
  const demoUsers = {
    admin: {
      id: 'admin001',
      email: 'admin@ayurtrace.com',
      password: 'admin123',
      role: 'admin',
      name: 'System Administrator',
      permissions: ['manage_users', 'view_analytics', 'manage_system', 'view_all_batches'],
      avatar: null,
      createdAt: new Date().toISOString(),
    },
    farmer: {
      id: 'farmer001', 
      email: 'farmer@example.com',
      password: 'farmer123',
      role: 'farmer',
      name: 'Rajesh Kumar',
      farmName: 'Green Valley Herbs Farm',
      location: 'Rishikesh, Uttarakhand',
      permissions: ['create_batch', 'view_own_batches', 'update_batch'],
      avatar: null,
      createdAt: new Date().toISOString(),
    },
    manufacturer: {
      id: 'mfg001',
      email: 'manufacturer@example.com', 
      password: 'manufacturer123',
      role: 'manufacturer',
      name: 'Priya Sharma',
      companyName: 'Ayur Processing Co.',
      location: 'Haridwar, Uttarakhand',
      permissions: ['process_batches', 'view_available_batches', 'create_products'],
      avatar: null,
      createdAt: new Date().toISOString(),
    },
    consumer: {
      id: 'consumer001',
      email: 'consumer@example.com',
      password: 'consumer123',
      role: 'consumer',
      name: 'Anjali Verma',
      permissions: ['verify_products', 'view_journey'],
      avatar: null,
      createdAt: new Date().toISOString(),
    }
  };

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('ayurTrace_token');
        const userData = localStorage.getItem('ayurTrace_user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear corrupted data
        localStorage.removeItem('ayurTrace_token');
        localStorage.removeItem('ayurTrace_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email and password
      const foundUser = Object.values(demoUsers).find(
        user => user.email === email && user.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Generate demo JWT token
      const token = `demo_token_${foundUser.id}_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('ayurTrace_token', token);
      localStorage.setItem('ayurTrace_user', JSON.stringify(userWithoutPassword));
      
      // Update state
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      return {
        success: true,
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const emailExists = Object.values(demoUsers).some(
        user => user.email === userData.email
      );

      if (emailExists) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: `${userData.role}_${Date.now()}`,
        ...userData,
        permissions: getDefaultPermissions(userData.role),
        avatar: null,
        createdAt: new Date().toISOString(),
      };

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Generate demo JWT token
      const token = `demo_token_${newUser.id}_${Date.now()}`;
      
      // Store in localStorage
      localStorage.setItem('ayurTrace_token', token);
      localStorage.setItem('ayurTrace_user', JSON.stringify(userWithoutPassword));
      
      // Update state
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      return {
        success: true,
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('ayurTrace_token');
    localStorage.removeItem('ayurTrace_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updatedData };
      
      // Store updated user data
      localStorage.setItem('ayurTrace_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Get default permissions for role
  const getDefaultPermissions = (role) => {
    const permissions = {
      admin: ['manage_users', 'view_analytics', 'manage_system', 'view_all_batches'],
      farmer: ['create_batch', 'view_own_batches', 'update_batch'],
      manufacturer: ['process_batches', 'view_available_batches', 'create_products'],
      consumer: ['verify_products', 'view_journey']
    };
    
    return permissions[role] || [];
  };

  // Get demo users for testing
  const getDemoUsers = () => {
    return Object.values(demoUsers).map(({ password, ...user }) => user);
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    hasRole,
    getDemoUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
