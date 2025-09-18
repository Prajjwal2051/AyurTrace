import React from 'react';

const LoadingSpinner = ({ 
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  color = 'success'
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-grow-sm'
  };

  // Color classes
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    info: 'text-info',
    light: 'text-light',
    dark: 'text-dark'
  };

  const spinnerClass = `spinner-border ${sizeClasses[size]} ${colorClasses[color]}`;

  if (fullScreen) {
    return (
      <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white" style={{ zIndex: 9999 }}>
        <div className="text-center">
          <div className={spinnerClass} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          {text && (
            <div className="mt-3">
              <p className="mb-0 text-muted">{text}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className="text-center">
        <div className={spinnerClass} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {text && (
          <div className="mt-2">
            <small className="text-muted">{text}</small>
          </div>
        )}
      </div>
    </div>
  );
};

// Specialized loading components
export const PageLoadingSpinner = ({ text = 'Loading page...' }) => (
  <LoadingSpinner fullScreen={true} text={text} />
);

export const ButtonLoadingSpinner = ({ text = 'Processing...' }) => (
  <div className="d-flex align-items-center">
    <div className="spinner-border spinner-border-sm me-2" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    {text}
  </div>
);

export const InlineLoadingSpinner = ({ size = 'sm', color = 'success' }) => (
  <div className={`spinner-border spinner-border-${size} ${color === 'success' ? 'text-success' : `text-${color}`}`} role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

export default LoadingSpinner;
