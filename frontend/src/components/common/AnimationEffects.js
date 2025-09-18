import React, { useState, useEffect, useCallback } from 'react';

const AnimationEffects = ({ children, enableSparkles = true, enableParticles = false, enableHoverGlow = true }) => {
  const [sparkles, setSparkles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate sparkle effects
  const createSparkle = useCallback((x, y, color = '#FFD700') => {
    const sparkle = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 50,
      y: y + (Math.random() - 0.5) * 50,
      color,
      size: Math.random() * 15 + 10,
      opacity: 1,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 100,
      velocityY: (Math.random() - 0.5) * 100 - 50
    };
    
    setSparkles(prev => [...prev.slice(-20), sparkle]); // Limit sparkles
    
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
    }, 2000);
    
    return sparkle;
  }, []);

  // Generate particle effects
  const createParticles = useCallback((x, y, count = 8) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const particle = {
        id: Date.now() + Math.random() + i,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        velocityX: (Math.random() - 0.5) * 200,
        velocityY: (Math.random() - 0.5) * 200 - 100,
        size: Math.random() * 6 + 3,
        color: `hsl(${120 + Math.random() * 40}, 70%, ${50 + Math.random() * 30}%)`,
        opacity: 1,
        life: 100
      };
      newParticles.push(particle);
    }
    
    setParticles(prev => [...prev.slice(-50), ...newParticles]); // Limit particles
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 3000);
  }, []);

  // Auto-generate ambient sparkles
  useEffect(() => {
    if (!enableSparkles) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.8;
        createSparkle(x, y, ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)]);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [createSparkle, enableSparkles]);

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    if (enableParticles && Math.random() > 0.95) { // 5% chance on mouse move
      createParticles(e.clientX, e.clientY, 3);
    }
  };

  // Handle clicks for sparkle effects
  const handleClick = (e) => {
    if (enableSparkles) {
      createSparkle(e.clientX, e.clientY);
      createSparkle(e.clientX, e.clientY, '#FF6B6B');
      createSparkle(e.clientX, e.clientY, '#4ECDC4');
    }
    
    if (enableParticles) {
      createParticles(e.clientX, e.clientY, 12);
    }
  };

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        overflow: 'hidden'
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {children}
      
      {/* Sparkle Effects */}
      {enableSparkles && sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          style={{
            position: 'fixed',
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'sparkleFloat 2s ease-out forwards',
            color: sparkle.color,
            fontSize: sparkle.size,
            transform: `rotate(${sparkle.rotation}deg)`
          }}
        >
          ✨
        </div>
      ))}
      
      {/* Particle Effects */}
      {enableParticles && particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: particle.color,
            pointerEvents: 'none',
            zIndex: 9998,
            animation: 'particleFloat 3s ease-out forwards',
            opacity: particle.opacity
          }}
        />
      ))}
      
      {/* Hover Glow Effect */}
      {enableHoverGlow && (
        <div
          style={{
            position: 'fixed',
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'all 0.1s ease-out',
            mixBlendMode: 'multiply'
          }}
        />
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes sparkleFloat {
          0% {
            transform: translateY(0) scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px) scale(1) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes particleFloat {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx, 50px), var(--dy, -100px)) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

// Sparkle Button Component
export const SparkleButton = ({ children, onClick, className = '', sparkleColor = '#FFD700', ...props }) => {
  const [sparkles, setSparkles] = useState([]);
  
  const handleClick = (e) => {
    // Create multiple sparkles on click
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
      const sparkle = {
        id: Date.now() + i,
        x: centerX + (Math.random() - 0.5) * rect.width,
        y: centerY + (Math.random() - 0.5) * rect.height,
        delay: i * 50
      };
      
      setSparkles(prev => [...prev, sparkle]);
      
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
      }, 2000 + sparkle.delay);
    }
    
    if (onClick) onClick(e);
  };
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        className={`sparkle-button ${className}`}
        onClick={handleClick}
        {...props}
        style={{
          ...props.style,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {children}
        
        {/* Button background shimmer effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          animation: 'shimmer 3s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
      </button>
      
      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          style={{
            position: 'fixed',
            left: sparkle.x,
            top: sparkle.y,
            fontSize: '16px',
            color: sparkleColor,
            pointerEvents: 'none',
            zIndex: 10000,
            animation: `sparkleFloat 2s ease-out ${sparkle.delay}ms forwards`
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

// Loading Animation Component
export const LoadingAnimation = ({ type = 'spinner', size = 40, color = '#4CAF50' }) => {
  switch (type) {
    case 'dots':
      return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: size / 4,
                height: size / 4,
                borderRadius: '50%',
                background: color,
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
              }}
            />
          ))}
          <style>{`
            @keyframes bounce {
              0%, 80%, 100% {
                transform: scale(0);
              }
              40% {
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      );
      
    case 'pulse':
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            animation: 'pulseGrow 1.5s ease-in-out infinite'
          }}
        >
          <style>{`
            @keyframes pulseGrow {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.2);
                opacity: 0.7;
              }
            }
          `}</style>
        </div>
      );
      
    default: // spinner
      return (
        <div
          style={{
            width: size,
            height: size,
            border: `${size / 10}px solid rgba(0,0,0,0.1)`,
            borderTop: `${size / 10}px solid ${color}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        >
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
  }
};

export default AnimationEffects;
