import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
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
          ...baseItems,
          { path: '/admin/users', label: 'User Management', icon: 'fas fa-users' },
          { path: '/admin/analytics', label: 'System Analytics', icon: 'fas fa-chart-line' },
          { path: '/admin/batches', label: 'All Batches', icon: 'fas fa-boxes' },
          { path: '/admin/settings', label: 'System Settings', icon: 'fas fa-cogs' }
        ];

      case 'farmer':
        return [
          ...baseItems,
          { path: '/farmer/add-batch', label: 'Add New Batch', icon: 'fas fa-plus-circle' },
          { path: '/farmer/batches', label: 'My Batches', icon: 'fas fa-seedling' },
          { path: '/farmer/profile', label: 'Farm Profile', icon: 'fas fa-tractor' },
          { path: '/farmer/analytics', label: 'My Analytics', icon: 'fas fa-chart-bar' }
        ];

      case 'manufacturer':
        return [
          ...baseItems,
          { path: '/manufacturer/available-batches', label: 'Available Herbs', icon: 'fas fa-leaf' },
          { path: '/manufacturer/processing', label: 'Processing', icon: 'fas fa-industry' },
          { path: '/manufacturer/products', label: 'My Products', icon: 'fas fa-box' },
          { path: '/manufacturer/quality', label: 'Quality Control', icon: 'fas fa-microscope' }
        ];

      case 'consumer':
        return [
          ...baseItems,
          { path: '/consumer/verify', label: 'Verify Product', icon: 'fas fa-search' },
          { path: '/consumer/scanner', label: 'QR Scanner', icon: 'fas fa-qrcode' },
          { path: '/consumer/history', label: 'My Verifications', icon: 'fas fa-history' }
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

            {/* Quick Actions */}
            {!isAuthenticated && (
              <li className="nav-item">
                <Link 
                  className="nav-link border rounded ms-2" 
                  to="/consumer/verify"
                  onClick={() => setIsCollapsed(true)}
                >
                  <i className="fas fa-search me-1"></i>
                  Verify Product
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
