import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  allowedRoles = null,
  redirectTo = '/login'
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate 
      to={redirectTo} 
      state={{ from: location }} 
      replace 
    />;
  }

  // Helper function to get user's appropriate dashboard
  const getUserDashboard = (userRole) => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'farmer':
        return '/farmer/dashboard';
      case 'manufacturer':
        return '/manufacturer/dashboard';
      case 'consumer':
        return '/consumer/dashboard';
      default:
        return '/';
    }
  };

  // Check for specific required role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to user's appropriate dashboard instead of showing 403
    return <Navigate to={getUserDashboard(user?.role)} replace />;
  }

  // Check for allowed roles (if multiple roles can access)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to user's appropriate dashboard instead of showing 403
    return <Navigate to={getUserDashboard(user?.role)} replace />;
  }

  // Check for specific permission
  if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
    // Redirect to user's appropriate dashboard instead of showing 403
    return <Navigate to={getUserDashboard(user?.role)} replace />;
  }

  // All checks passed, render the protected component
  return children;
};

// Higher-order component for role-specific routes
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    {children}
  </ProtectedRoute>
);

export const FarmerRoute = ({ children }) => (
  <ProtectedRoute requiredRole="farmer">
    {children}
  </ProtectedRoute>
);

export const ManufacturerRoute = ({ children }) => (
  <ProtectedRoute requiredRole="manufacturer">
    {children}
  </ProtectedRoute>
);

export const ConsumerRoute = ({ children }) => (
  <ProtectedRoute requiredRole="consumer">
    {children}
  </ProtectedRoute>
);

// Component for routes that require authentication but allow multiple roles
export const AuthenticatedRoute = ({ children, allowedRoles = null }) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
