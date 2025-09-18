import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, getDemoUsers } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Get demo users for quick login
  const demoUsers = getDemoUsers();
  const from = location.state?.from?.pathname || '/dashboard';

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  // Quick login with demo credentials
  const handleDemoLogin = (demoUser) => {
    const passwords = {
      admin: 'admin123',
      farmer: 'farmer123',
      manufacturer: 'manufacturer123',
      consumer: 'consumer123'
    };
    
    setFormData({
      email: demoUser.email, // Use the actual email from demoUser
      password: passwords[demoUser.role] || demoUser.role + '123',
      rememberMe: false
    });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Login Card */}
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-success text-white text-center py-4">
                <h3 className="mb-0 fw-bold">
                  <i className="fas fa-leaf me-2"></i>
                  Welcome Back to AyurTrace
                </h3>
                <p className="mb-0 opacity-75">Sign in to your account</p>
              </div>
              
              <div className="card-body p-4">
                {/* Demo Credentials Toggle */}
                <div className="text-center mb-3">
                  <button 
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  >
                    <i className="fas fa-info-circle me-1"></i>
                    Show Demo Credentials
                  </button>
                </div>

                {/* Demo Credentials Section */}
                {showDemoCredentials && (
                  <div className="alert alert-info mb-4">
                    <h6 className="alert-heading">
                      <i className="fas fa-user-circle me-2"></i>
                      Demo Login Credentials
                    </h6>
                    <div className="row g-2">
                      {demoUsers.map((user) => (
                        <div key={user.id} className="col-6">
                          <button
                            className="btn btn-outline-secondary btn-sm w-100 text-start"
                            onClick={() => handleDemoLogin(user)}
                          >
                            <div className="fw-bold">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
                            <small className="text-muted">{user.name}</small>
                          </button>
                        </div>
                      ))}
                    </div>
                    <hr />
                    <small className="text-muted">
                      <strong>Pattern:</strong> {'{role}'}@example.com / {'{role}'}123<br/>
                      <strong>Admin:</strong> admin@ayurtrace.com / admin123
                    </small>
                  </div>
                )}

                {/* Error Message */}
                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {errors.submit}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary position-absolute end-0 top-0 h-100 px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Social Login Options */}
                <div className="text-center mb-3">
                  <div className="position-relative">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <button className="btn btn-outline-danger w-100" disabled>
                      <i className="fab fa-google me-2"></i>
                      Google
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-info w-100" disabled>
                      <i className="fas fa-government me-2"></i>
                      AYUSH Portal
                    </button>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span className="text-muted">Don't have an account?</span>
                  <Link to="/register" className="text-decoration-none ms-2">
                    <strong>Create Account</strong>
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="card-footer text-center text-muted py-3">
                <small>
                  Protected by blockchain security
                  <i className="fas fa-shield-alt ms-2 text-success"></i>
                </small>
              </div>
            </div>

            {/* Features */}
            <div className="row text-center mt-4">
              <div className="col-4">
                <div className="text-success mb-2">
                  <i className="fas fa-shield-check fa-2x"></i>
                </div>
                <small className="text-muted">Secure Login</small>
              </div>
              <div className="col-4">
                <div className="text-success mb-2">
                  <i className="fas fa-user-check fa-2x"></i>
                </div>
                <small className="text-muted">Role-Based Access</small>
              </div>
              <div className="col-4">
                <div className="text-success mb-2">
                  <i className="fas fa-mobile-alt fa-2x"></i>
                </div>
                <small className="text-muted">Mobile Friendly</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
