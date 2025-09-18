import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    farmName: '',
    companyName: '',
    location: '',
    phone: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Role options
  const roleOptions = [
    {
      value: 'farmer',
      label: 'Farmer',
      description: 'I grow and harvest herbs',
      icon: 'fas fa-seedling',
      color: 'text-success'
    },
    {
      value: 'manufacturer',
      label: 'Manufacturer', 
      description: 'I process herbs into products',
      icon: 'fas fa-industry',
      color: 'text-primary'
    },
    {
      value: 'consumer',
      label: 'Consumer',
      description: 'I want to verify products',
      icon: 'fas fa-user',
      color: 'text-info'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'System administrator',
      icon: 'fas fa-cog',
      color: 'text-warning'
    }
  ];

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    // Role-specific validation
    if (formData.role === 'farmer' && !formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required for farmers';
    }
    
    if (formData.role === 'manufacturer' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required for manufacturers';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      // Remove confirmPassword before sending to register
      const { confirmPassword, agreeToTerms, ...userData } = formData;
      await register(userData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Registration Card */}
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-header bg-success text-white text-center py-4">
                <h3 className="mb-0 fw-bold">
                  <i className="fas fa-user-plus me-2"></i>
                  Join AyurTrace
                </h3>
                <p className="mb-0 opacity-75">Create your account to get started</p>
              </div>
              
              <div className="card-body p-4">
                {/* Error Message */}
                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {errors.submit}
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          <i className="fas fa-user me-2"></i>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                          <i className="fas fa-phone me-2"></i>
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          <i className="fas fa-lock me-2"></i>
                          Password *
                        </label>
                        <div className="position-relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary position-absolute end-0 top-0 h-100 px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                          {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          <i className="fas fa-check-circle me-2"></i>
                          Confirm Password *
                        </label>
                        <div className="position-relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat password"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary position-absolute end-0 top-0 h-100 px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                          {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-user-tag me-2"></i>
                      I am a... *
                    </label>
                    <div className="row g-2">
                      {roleOptions.map((role) => (
                        <div key={role.value} className="col-md-6">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="role"
                              id={role.value}
                              value={role.value}
                              checked={formData.role === role.value}
                              onChange={handleChange}
                            />
                            <label className="form-check-label w-100" htmlFor={role.value}>
                              <div className="card border p-3 h-100">
                                <div className={`${role.color} mb-2`}>
                                  <i className={`${role.icon} fa-lg`}></i>
                                </div>
                                <div className="fw-bold">{role.label}</div>
                                <small className="text-muted">{role.description}</small>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.role && (
                      <div className="text-danger mt-1">
                        <small>{errors.role}</small>
                      </div>
                    )}
                  </div>

                  {/* Role-specific Fields */}
                  {formData.role === 'farmer' && (
                    <div className="mb-3">
                      <label htmlFor="farmName" className="form-label">
                        <i className="fas fa-tractor me-2"></i>
                        Farm Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.farmName ? 'is-invalid' : ''}`}
                        id="farmName"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleChange}
                        placeholder="e.g., Green Valley Herbs Farm"
                      />
                      {errors.farmName && (
                        <div className="invalid-feedback">{errors.farmName}</div>
                      )}
                    </div>
                  )}

                  {formData.role === 'manufacturer' && (
                    <div className="mb-3">
                      <label htmlFor="companyName" className="form-label">
                        <i className="fas fa-building me-2"></i>
                        Company Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g., Ayur Processing Co."
                      />
                      {errors.companyName && (
                        <div className="invalid-feedback">{errors.companyName}</div>
                      )}
                    </div>
                  )}

                  {/* Location */}
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Location *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State"
                    />
                    {errors.location && (
                      <div className="invalid-feedback">{errors.location}</div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="agreeToTerms">
                        I agree to the <Link to="/terms" target="_blank">Terms & Conditions</Link> and{' '}
                        <Link to="/privacy" target="_blank">Privacy Policy</Link> *
                      </label>
                      {errors.agreeToTerms && (
                        <div className="text-danger mt-1">
                          <small>{errors.agreeToTerms}</small>
                        </div>
                      )}
                    </div>
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="text-center">
                  <span className="text-muted">Already have an account?</span>
                  <Link to="/login" className="text-decoration-none ms-2">
                    <strong>Sign In</strong>
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="card-footer text-center text-muted py-3">
                <small>
                  By registering, you join the blockchain revolution in Ayurvedic supply chain
                  <i className="fas fa-leaf ms-2 text-success"></i>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
