import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [scannerInput, setScannerInput] = useState('');

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Handle batch verification
  const handleBatchVerification = (batchId) => {
    if (batchId && batchId.trim()) {
      // Navigate to consumer dashboard with the batch ID
      if (isAuthenticated && user?.role === 'consumer') {
        navigate('/consumer/dashboard', { state: { batchId: batchId.trim() } });
      } else {
        // For non-authenticated users or other roles, show an alert
        alert(`Batch ID: ${batchId}\n\nTo verify this product, please log in as a consumer or visit our consumer portal.`);
      }
      setScannerInput('');
    }
  };

  // Handle QR scanner activation
  const handleQRScanner = () => {
    if (isAuthenticated && user?.role === 'consumer') {
      navigate('/consumer/dashboard');
    } else {
      alert('QR Scanner is available for registered consumers. Please log in as a consumer to use this feature.');
    }
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!isAuthenticated || !user) return [];

    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' }
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseItems
        ];

      case 'farmer':
        return [
          ...baseItems
        ];

      case 'manufacturer':
        return [
          ...baseItems
        ];

      case 'consumer':
        return [
          ...baseItems
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  // Check if route is active
  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <style>{`
        .scanner-input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .scanner-input:focus {
          box-shadow: none !important;
          background: transparent !important;
        }
        .scanner-container:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transition: all 0.3s ease;
        }
        .navbar .scanner-input {
          color: white !important;
        }
      `}</style>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="fas fa-leaf me-2"></i>
          AyurTrace
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}>
          {/* Left Side - Navigation Links */}
          {isAuthenticated && (
            <ul className="navbar-nav me-auto">
              {navigationItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                    to={item.path}
                    onClick={() => setIsCollapsed(true)}
                  >
                    <i className={`${item.icon} me-1`}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Center - Product Scanner */}
          <div className="d-flex align-items-center mx-auto">
            <div className="d-none d-lg-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-2 border border-white border-opacity-25 scanner-container">
              <i className="fas fa-qrcode text-white me-2"></i>
              <input 
                type="text" 
                className="form-control form-control-sm border-0 bg-transparent text-white scanner-input"
                placeholder="Enter batch ID or scan QR code..."
                value={scannerInput}
                onChange={(e) => setScannerInput(e.target.value)}
                style={{
                  background: 'transparent !important',
                  boxShadow: 'none',
                  color: 'white',
                  width: '280px'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleBatchVerification(scannerInput);
                  }
                }}
              />
              <button 
                className="btn btn-light btn-sm ms-2 d-flex align-items-center"
                style={{ fontSize: '12px', padding: '4px 8px' }}
                onClick={handleQRScanner}
              >
                <i className="fas fa-camera me-1"></i>
                Scan
              </button>
            </div>
            
            {/* Mobile Version */}
            <div className="d-lg-none">
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={handleQRScanner}
              >
                <i className="fas fa-qrcode me-1"></i>
                Scanner
              </button>
            </div>
          </div>

          {/* Right Side - User Menu or Auth Links */}
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                {/* User Info Dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link text-white border-0"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle me-1"></i>
                    {user?.name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <div className="dropdown-header">
                        <div className="fw-bold">{user?.name}</div>
                        <small className="text-muted">
                          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </small>
                      </div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="fas fa-user me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/settings">
                        <i className="fas fa-cog me-2"></i>
                        Settings
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>

                {/* Role Badge */}
                <li className="nav-item d-flex align-items-center ms-2">
                  <span className="badge bg-light text-dark">
                    <i className="fas fa-user-tag me-1"></i>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </li>
              </>
            ) : (
              <>
                {/* Public Navigation Links */}
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/login"
                    onClick={() => setIsCollapsed(true)}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/register"
                    onClick={() => setIsCollapsed(true)}
                  >
                    <i className="fas fa-user-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
      </nav>
    </>
  );
};

export default Navigation;
