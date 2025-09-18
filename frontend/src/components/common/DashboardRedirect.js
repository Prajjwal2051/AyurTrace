import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const DashboardRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading while determining auth status
  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Redirecting to dashboard..." />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'farmer':
      return <Navigate to="/farmer/dashboard" replace />;
    case 'manufacturer':
      return <Navigate to="/manufacturer/dashboard" replace />;
    case 'consumer':
      return <Navigate to="/consumer/dashboard" replace />;
    default:
      // Fallback to home page if role is not recognized
      return <Navigate to="/" replace />;
  }
};

export default DashboardRedirect;
