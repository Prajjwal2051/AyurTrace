import React, { useState, useEffect } from 'react';
import localStorageManager from '../../utils/localStorage';

const SupplyChainVisualization = ({ batchId, interactive = true, showDetails = true }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [batchData, setBatchData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultSteps = [
    { 
      name: '🌱 Collection', 
      color: '#4CAF50', 
      description: 'Herb harvesting from certified farms',
      icon: '🌱',
      stage: 'harvest'
    },
    { 
      name: '📦 Processing', 
      color: '#FF9800', 
      description: 'Quality testing and initial processing',
      icon: '📦',
      stage: 'processing'
    },
    { 
      name: '🏭 Manufacturing', 
      color: '#2196F3', 
      description: 'Product creation and packaging',
      icon: '🏭',
      stage: 'manufacturing'
    },
    { 
      name: '🏪 Retail', 
      color: '#9C27B0', 
      description: 'Distribution to retail partners',
      icon: '🏪',
      stage: 'retail'
    },
    { 
      name: '👤 Consumer', 
      color: '#4CAF50', 
      description: 'Final verification by consumers',
      icon: '👤',
      stage: 'consumer'
    }
  ];

  useEffect(() => {
    if (batchId) {
      const journeyData = localStorageManager.getSupplyChainJourney(batchId);
      if (journeyData) {
        setBatchData(journeyData);
        
        // Determine current step based on batch status
        const batch = journeyData.batch;
        let step = 0;
        
        if (batch.status === 'Harvested') step = 1;
        else if (batch.status === 'Processing') step = 2;
        else if (batch.status === 'Manufactured') step = 3;
        else if (batch.status === 'Retail') step = 4;
        else if (batch.status === 'Delivered') step = 5;
        
        setCurrentStep(step);
      }
    }
  }, [batchId]);

  useEffect(() => {
    if (interactive && isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % defaultSteps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, interactive, defaultSteps.length]);

  const handleStepClick = (stepIndex) => {
    if (interactive) {
      setCurrentStep(stepIndex);
      setIsPlaying(false);
    }
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const getStepStatus = (stepIndex) => {
    if (batchData) {
      // Return actual status based on batch data
      return stepIndex <= currentStep ? 'completed' : 'pending';
    }
    return stepIndex <= currentStep ? 'completed' : stepIndex === currentStep ? 'current' : 'pending';
  };

  const getStepStyle = (step, index) => {
    const status = getStepStatus(index);
    const isActive = index === currentStep;
    
    let backgroundColor;
    let color;
    let boxShadow;
    
    if (status === 'completed') {
      backgroundColor = step.color;
      color = 'white';
      boxShadow = `0 8px 25px ${step.color}40`;
    } else if (status === 'current' || isActive) {
      backgroundColor = `linear-gradient(135deg, ${step.color}, ${step.color}CC)`;
      color = 'white';
      boxShadow = `0 15px 35px ${step.color}50`;
    } else {
      backgroundColor = '#f8f9fa';
      color = '#666';
      boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    }

    return {
      background: backgroundColor,
      color: color,
      padding: showDetails ? '25px' : '15px',
      borderRadius: '15px',
      textAlign: 'center',
      minWidth: showDetails ? '180px' : '120px',
      margin: '10px',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: boxShadow,
      cursor: interactive ? 'pointer' : 'default',
      transform: isActive && interactive ? 'scale(1.05) translateY(-5px)' : 'scale(1) translateY(0)',
      position: 'relative',
      overflow: 'hidden'
    };
  };

  const getArrowStyle = (index) => ({
    position: 'absolute',
    right: '-30px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '24px',
    color: index < currentStep ? '#4CAF50' : '#ddd',
    zIndex: 1,
    transition: 'color 0.3s ease'
  });

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: showDetails ? '40px' : '30px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 style={{ 
          color: '#333', 
          marginBottom: '10px',
          fontSize: showDetails ? '1.5rem' : '1.2rem'
        }}>
          {batchId ? `Supply Chain Journey - ${batchId}` : 'Supply Chain Journey'}
        </h3>
        {interactive && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={toggleAnimation}
              style={{
                background: isPlaying 
                  ? 'linear-gradient(45deg, #f44336, #e91e63)' 
                  : 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
              }}
            >
              {isPlaying ? '⏸️ Pause Animation' : '▶️ Play Animation'}
            </button>
          </div>
        )}
      </div>

      {/* Supply Chain Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'relative'
      }}>
        {defaultSteps.map((step, index) => (
          <div key={index} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div
              style={getStepStyle(step, index)}
              onClick={() => handleStepClick(index)}
              onMouseEnter={(e) => {
                if (interactive) {
                  e.currentTarget.style.transform = 'scale(1.08) translateY(-8px)';
                }
              }}
              onMouseLeave={(e) => {
                if (interactive) {
                  const isActive = index === currentStep;
                  e.currentTarget.style.transform = isActive 
                    ? 'scale(1.05) translateY(-5px)' 
                    : 'scale(1) translateY(0)';
                }
              }}
            >
              {/* Ripple effect for active step */}
              {index === currentStep && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '15px',
                  animation: 'pulse 2s infinite'
                }} />
              )}
              
              <div style={{ 
                fontSize: showDetails ? '1.5em' : '1.2em', 
                marginBottom: showDetails ? '8px' : '4px',
                position: 'relative',
                zIndex: 1
              }}>
                {step.icon}
              </div>
              
              <div style={{ 
                fontSize: showDetails ? '1.1em' : '0.9em', 
                fontWeight: '600',
                marginBottom: showDetails ? '5px' : '2px',
                position: 'relative',
                zIndex: 1
              }}>
                {step.name.replace(/^\S+\s/, '')} {/* Remove emoji for cleaner look */}
              </div>
              
              {showDetails && (
                <div style={{ 
                  fontSize: '0.8em', 
                  opacity: 0.9,
                  lineHeight: '1.2',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {step.description}
                </div>
              )}

              {/* Progress indicator */}
              {getStepStatus(index) === 'completed' && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: step.color,
                  zIndex: 2
                }}>
                  ✓
                </div>
              )}
            </div>

            {/* Arrow */}
            {index < defaultSteps.length - 1 && (
              <div style={getArrowStyle(index)}>
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{
        margin: '30px 0 20px 0',
        height: '4px',
        background: '#e0e0e0',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
          width: `${(currentStep / (defaultSteps.length - 1)) * 100}%`,
          transition: 'width 0.5s ease',
          borderRadius: '2px'
        }} />
      </div>

      {/* Current Step Details */}
      {showDetails && batchData && (
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '10px',
          padding: '20px',
          marginTop: '20px',
          border: '1px solid rgba(76, 175, 80, 0.2)'
        }}>
          <h4 style={{ color: '#4CAF50', marginBottom: '10px' }}>
            Current Stage: {defaultSteps[currentStep]?.name}
          </h4>
          <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
            <strong>Batch:</strong> {batchData.batch.crop} - {batchData.batch.quantity}<br />
            <strong>Farmer:</strong> {batchData.batch.farmerName}<br />
            <strong>Location:</strong> {batchData.batch.location}<br />
            <strong>Status:</strong> <span style={{ 
              color: '#4CAF50', 
              fontWeight: '600' 
            }}>{batchData.batch.status}</span>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @media (max-width: 768px) {
          .supply-chain-steps {
            flex-direction: column;
          }
          
          .supply-chain-steps .arrow {
            content: '↓';
            right: 50%;
            top: -15px;
            transform: translateX(50%) rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SupplyChainVisualization;
