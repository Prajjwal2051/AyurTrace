import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'farmer':
          navigate('/farmer/dashboard');
          break;
        case 'manufacturer':
          navigate('/manufacturer/dashboard');
          break;
        case 'consumer':
          navigate('/consumer/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            {/* Error Icon */}
            <div className="mb-4">
              <i className="fas fa-shield-alt text-warning" style={{ fontSize: '5rem' }}></i>
            </div>

            {/* Error Message */}
            <h1 className="display-4 fw-bold text-dark mb-3">
              403 - Access Denied
            </h1>
            <p className="lead text-muted mb-4">
              You don't have permission to access this resource.
            </p>

            {/* User Info */}
            {isAuthenticated && user && (
              <div className="alert alert-info mb-4">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="fas fa-user-circle me-2"></i>
                  <div>
                    <strong>{user.name}</strong>
                    <br />
                    <small>Role: {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</small>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title text-dark">
                  <i className="fas fa-info-circle text-info me-2"></i>
                  What happened?
                </h5>
                <p className="card-text text-muted">
                  This page or resource requires specific permissions that your current account doesn't have. 
                  This could be due to:
                </p>
                <ul className="list-unstyled text-start text-muted">
                  <li className="mb-2">
                    <i className="fas fa-check text-warning me-2"></i>
                    Role-based access restrictions
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-warning me-2"></i>
                    Insufficient permissions for this action
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-warning me-2"></i>
                    Administrative privileges required
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button 
                className="btn btn-outline-secondary"
                onClick={handleGoBack}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Go Back
              </button>

              <button 
                className="btn btn-success"
                onClick={handleGoToDashboard}
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                {isAuthenticated ? 'My Dashboard' : 'Login'}
              </button>

              <Link to="/" className="btn btn-outline-success">
                <i className="fas fa-home me-2"></i>
                Home
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-5 pt-4 border-top">
              <h6 className="text-muted mb-3">Need Help?</h6>
              <div className="d-flex justify-content-center gap-4 text-muted small">
                <div>
                  <i className="fas fa-envelope me-1"></i>
                  support@ayurtrace.com
                </div>
                <div>
                  <i className="fas fa-phone me-1"></i>
                  +91 98765 43210
                </div>
              </div>
            </div>

            {/* Role Information */}
            {isAuthenticated && (
              <div className="mt-4">
                <div className="alert alert-light">
                  <small className="text-muted">
                    <i className="fas fa-lightbulb me-1 text-warning"></i>
                    <strong>Tip:</strong> Different user roles have access to different features. 
                    Contact your administrator if you need additional permissions.
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
