import React, { useState, useEffect } from 'react';

// Enhanced Progress Bar with gradient and animation
export const ProgressBar = ({ 
  progress = 0, 
  height = 8, 
  animated = true,
  showPercentage = false,
  color = '#4CAF50',
  backgroundColor = '#f0f0f0',
  borderRadius = 4
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div 
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${animatedProgress}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            borderRadius: `${borderRadius}px`,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {animated && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                background: `linear-gradient(90deg, 
                  transparent, 
                  rgba(255, 255, 255, 0.3), 
                  transparent)`,
                animation: 'shimmerProgress 2s infinite'
              }}
            />
          )}
        </div>
      </div>
      {showPercentage && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: `-${height + 20}px`,
          fontSize: '12px',
          fontWeight: '600',
          color: color
        }}>
          {Math.round(animatedProgress)}%
        </div>
      )}
      
      <style>{`
        @keyframes shimmerProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

// Enhanced Card with hover effects and glassmorphism
export const GlassCard = ({ 
  children, 
  className = '', 
  style = {}, 
  hoverEffect = true,
  glowColor = '#4CAF50',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`glass-card ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '25px',
        boxShadow: isHovered && hoverEffect
          ? `0 25px 50px rgba(0,0,0,0.15), 0 0 30px ${glowColor}30`
          : '0 15px 35px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered && hoverEffect ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};

// Animated Counter Component
export const AnimatedCounter = ({ 
  endValue = 0, 
  startValue = 0, 
  duration = 2000,
  prefix = '',
  suffix = '',
  fontSize = '2rem',
  fontWeight = '700',
  color = '#4CAF50'
}) => {
  const [currentValue, setCurrentValue] = useState(startValue);

  useEffect(() => {
    let startTime;
    const animateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        const value = startValue + (endValue - startValue) * easeOutExpo(progress);
        setCurrentValue(Math.floor(value));
        requestAnimationFrame(animateCounter);
      } else {
        setCurrentValue(endValue);
      }
    };

    requestAnimationFrame(animateCounter);
  }, [endValue, startValue, duration]);

  const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  return (
    <span style={{ 
      fontSize, 
      fontWeight, 
      color,
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </span>
  );
};

// Interactive Badge with pulse animation
export const PulseBadge = ({ 
  children, 
  variant = 'success',
  size = 'md',
  pulseColor,
  ...props 
}) => {
  const variants = {
    success: '#28a745',
    warning: '#ffc107', 
    danger: '#dc3545',
    info: '#17a2b8',
    primary: '#007bff'
  };

  const sizes = {
    sm: { padding: '4px 8px', fontSize: '11px' },
    md: { padding: '6px 12px', fontSize: '13px' },
    lg: { padding: '8px 16px', fontSize: '15px' }
  };

  const color = variants[variant] || variant;
  const finalPulseColor = pulseColor || color;

  return (
    <span
      style={{
        background: color,
        color: 'white',
        borderRadius: '20px',
        fontWeight: '600',
        display: 'inline-block',
        position: 'relative',
        animation: 'pulseGently 2s ease-in-out infinite',
        ...sizes[size]
      }}
      {...props}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '20px',
          background: finalPulseColor,
          opacity: 0.3,
          animation: 'expandPulse 2s ease-in-out infinite'
        }}
      />
      
      <style>{`
        @keyframes pulseGently {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes expandPulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
};

// Enhanced Tooltip with animation
export const Tooltip = ({ children, text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-8px)',
      marginBottom: '5px'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
      marginTop: '5px'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-8px)',
      marginRight: '5px'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(8px)',
      marginLeft: '5px'
    }
  };

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 10000,
            backdropFilter: 'blur(10px)',
            animation: 'fadeInTooltip 0.2s ease-out',
            ...positions[position]
          }}
        >
          {text}
          <style>{`
            @keyframes fadeInTooltip {
              from {
                opacity: 0;
                transform: ${positions[position].transform} scale(0.95);
              }
              to {
                opacity: 1;
                transform: ${positions[position].transform} scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

// Enhanced Button with ripple effect
export const RippleButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  rippleColor = 'rgba(255, 255, 255, 0.6)',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);

  const variants = {
    primary: { bg: 'linear-gradient(45deg, #4CAF50, #8BC34A)', color: 'white' },
    secondary: { bg: 'linear-gradient(45deg, #6c757d, #495057)', color: 'white' },
    success: { bg: 'linear-gradient(45deg, #28a745, #20c997)', color: 'white' },
    danger: { bg: 'linear-gradient(45deg, #dc3545, #e74c3c)', color: 'white' },
    warning: { bg: 'linear-gradient(45deg, #ffc107, #fd7e14)', color: 'white' }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' }
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <button
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        background: variants[variant]?.bg || variant,
        color: variants[variant]?.color || 'white',
        ...sizes[size],
        ...props.style
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: rippleColor,
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none'
          }}
        />
      ))}
      
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

const EnhancedUI = {
  ProgressBar,
  GlassCard,
  AnimatedCounter,
  PulseBadge,
  Tooltip,
  RippleButton
};

export default EnhancedUI;
