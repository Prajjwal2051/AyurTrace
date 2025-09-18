import React, { useState, useEffect } from 'react';

const QRScanner = ({ onScan, onError, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'manual'
  const [error, setError] = useState('');

  // Simulate QR scanning functionality
  const startScanning = () => {
    setIsScanning(true);
    setError('');
    
    // Simulate scanner initialization
    setTimeout(() => {
      // This is a mock implementation
      // In a real app, you would integrate with a QR scanning library
      console.log('QR Scanner started...');
    }, 500);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) {
      setError('Please enter a batch ID or QR code');
      return;
    }

    // Validate batch ID format
    if (!manualInput.match(/^BATCH-[A-Z]-\d{4}-\d{3}$/)) {
      setError('Invalid batch ID format. Expected format: BATCH-X-YYYY-NNN');
      return;
    }

    onScan(manualInput.trim());
  };

  const simulateSuccessfulScan = () => {
    // Simulate successful QR scan
    const mockBatchId = 'BATCH-F-2024-015';
    onScan(mockBatchId);
    setIsScanning(false);
  };

  const simulateFailedScan = () => {
    setError('QR code not recognized. Please try again or enter batch ID manually.');
    setIsScanning(false);
    onError && onError('QR code not recognized');
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="modal show d-block" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '25px',
        padding: '0',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        width: '90%',
        maxWidth: '600px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
          padding: '20px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h5 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>
            📱 Product Scanner
          </h5>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
            Scan QR codes to verify product authenticity
          </p>
          <button
            type="button"
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '30px' }}>
          {/* Scanner Mode Toggle */}
          <div style={{
            display: 'flex',
            background: '#f8f9fa',
            borderRadius: '15px',
            padding: '5px',
            marginBottom: '25px'
          }}>
            <button
              type="button"
              style={{
                flex: 1,
                background: scanMode === 'camera' 
                  ? 'linear-gradient(45deg, #4CAF50, #8BC34A)'
                  : 'transparent',
                color: scanMode === 'camera' ? 'white' : '#666',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: scanMode === 'camera' ? '0 5px 15px rgba(76, 175, 80, 0.3)' : 'none'
              }}
              onClick={() => setScanMode('camera')}
              onMouseEnter={(e) => {
                if (scanMode !== 'camera') {
                  e.currentTarget.style.background = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (scanMode !== 'camera') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              📷 Camera Scanner
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                background: scanMode === 'manual' 
                  ? 'linear-gradient(45deg, #4CAF50, #8BC34A)'
                  : 'transparent',
                color: scanMode === 'manual' ? 'white' : '#666',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: scanMode === 'manual' ? '0 5px 15px rgba(76, 175, 80, 0.3)' : 'none'
              }}
              onClick={() => setScanMode('manual')}
              onMouseEnter={(e) => {
                if (scanMode !== 'manual') {
                  e.currentTarget.style.background = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (scanMode !== 'manual') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              ⌨️ Manual Entry
            </button>
          </div>

          {error && (
            <div style={{
              background: 'linear-gradient(45deg, rgba(220, 53, 69, 0.1), rgba(231, 76, 60, 0.1))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '12px',
              padding: '15px 20px',
              marginBottom: '20px',
              color: '#d63384'
            }}>
              ⚠️ {error}
            </div>
          )}

          {scanMode === 'camera' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(15px)',
                borderRadius: '20px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '25px'
              }}>
                {!isScanning ? (
                  <div style={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(248, 249, 250, 0.8)',
                    borderRadius: '15px',
                    border: '2px dashed #dee2e6',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ textAlign: 'center', zIndex: 2 }}>
                      <div style={{ fontSize: '64px', marginBottom: '15px', opacity: 0.6 }}>📷</div>
                      <p style={{ color: '#6c757d', margin: 0, fontSize: '16px' }}>Click "Start Scanner" to begin scanning</p>
                    </div>
                    
                    {/* Animated background elements */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(76, 175, 80, 0.05) 20px, rgba(76, 175, 80, 0.05) 40px)',
                      animation: 'slidePattern 20s linear infinite',
                      zIndex: 1
                    }}></div>
                  </div>
                ) : (
                  <div style={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
                    borderRadius: '15px',
                    border: '2px solid rgba(76, 175, 80, 0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Scanning Frame */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '200px',
                      height: '200px',
                      border: '3px solid #4CAF50',
                      borderRadius: '15px',
                      boxShadow: '0 0 30px rgba(76, 175, 80, 0.5)',
                      animation: 'scannerPulse 2s ease-in-out infinite'
                    }}>
                      {/* Corner Markers */}
                      <div style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '-6px',
                        width: '40px',
                        height: '40px',
                        borderTop: '6px solid #4CAF50',
                        borderLeft: '6px solid #4CAF50',
                        borderRadius: '10px 0 0 0'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '40px',
                        height: '40px',
                        borderTop: '6px solid #4CAF50',
                        borderRight: '6px solid #4CAF50',
                        borderRadius: '0 10px 0 0'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '-6px',
                        width: '40px',
                        height: '40px',
                        borderBottom: '6px solid #4CAF50',
                        borderLeft: '6px solid #4CAF50',
                        borderRadius: '0 0 0 10px'
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        right: '-6px',
                        width: '40px',
                        height: '40px',
                        borderBottom: '6px solid #4CAF50',
                        borderRight: '6px solid #4CAF50',
                        borderRadius: '0 0 10px 0'
                      }}></div>
                      
                      {/* Scanning Line */}
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '10px',
                        right: '10px',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #4CAF50, #8BC34A, #4CAF50, transparent)',
                        boxShadow: '0 0 10px #4CAF50',
                        animation: 'scanLine 2s linear infinite'
                      }}></div>
                    </div>
                    
                    <div style={{ textAlign: 'center', color: 'white', zIndex: 2 }}>
                      <p style={{ margin: 0, fontSize: '16px', opacity: 0.9, marginTop: '120px' }}>Position QR code within the frame</p>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {!isScanning ? (
                  <button
                    style={{
                      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      padding: '15px 30px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                    }}
                    onClick={startScanning}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(76, 175, 80, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
                    }}
                  >
                    ▶️ Start Scanner
                  </button>
                ) : (
                  <>
                    <button
                      style={{
                        background: 'linear-gradient(45deg, #dc3545, #e74c3c)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 5px 15px rgba(220, 53, 69, 0.3)'
                      }}
                      onClick={stopScanning}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(220, 53, 69, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(220, 53, 69, 0.3)';
                      }}
                    >
                      ⏹️ Stop
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(45deg, #28a745, #20c997)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)'
                      }}
                      onClick={simulateSuccessfulScan}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
                      }}
                    >
                      ✓ Simulate Success
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(45deg, #ffc107, #fd7e14)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 5px 15px rgba(255, 193, 7, 0.3)'
                      }}
                      onClick={simulateFailedScan}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 193, 7, 0.3)';
                      }}
                    >
                      ✖ Simulate Failure
                    </button>
                  </>
                )}
              </div>

              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(13, 202, 240, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(13, 202, 240, 0.2)'
              }}>
                <small style={{ color: '#0dcaf0', fontSize: '13px' }}>
                  💡 Hold your device steady and ensure good lighting for best results
                </small>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <form onSubmit={handleManualSubmit}>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    color: '#495057',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    📊 Enter Batch ID or QR Code Data
                  </label>
                  <input
                    type="text"
                    id="manualBatchId"
                    placeholder="BATCH-F-2024-XXX"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      border: '2px solid rgba(76, 175, 80, 0.3)',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#4CAF50';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <div style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: '#6c757d',
                    opacity: 0.8
                  }}>
                    Expected format: BATCH-[F/M/A]-YYYY-NNN (e.g., BATCH-F-2024-001)
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '15px 30px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
                  }}
                >
                  🔍 Verify Product
                </button>
              </form>

              <div style={{ marginTop: '30px' }}>
                <h6 style={{
                  color: '#6c757d',
                  marginBottom: '15px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>Sample Batch IDs for Testing:</h6>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    'BATCH-F-2024-012',
                    'BATCH-F-2024-013',
                    'BATCH-M-2024-001',
                    'BATCH-F-2024-014'
                  ].map(batchId => (
                    <button
                      key={batchId}
                      style={{
                        background: 'rgba(108, 117, 125, 0.1)',
                        border: '1px solid rgba(108, 117, 125, 0.3)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        color: '#495057',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      onClick={() => setManualInput(batchId)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(76, 175, 80, 0.1)';
                        e.currentTarget.style.borderColor = '#4CAF50';
                        e.currentTarget.style.color = '#4CAF50';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(108, 117, 125, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(108, 117, 125, 0.3)';
                        e.currentTarget.style.color = '#495057';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {batchId}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(248, 249, 250, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <button 
            type="button" 
            style={{
              background: 'rgba(108, 117, 125, 0.2)',
              border: '1px solid rgba(108, 117, 125, 0.3)',
              borderRadius: '10px',
              padding: '10px 20px',
              color: '#6c757d',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(108, 117, 125, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(108, 117, 125, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </button>
          
          {scanMode === 'camera' && (
            <div style={{
              color: '#6c757d',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              📱 Camera access required for scanning
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Scanner CSS Styles */}
      <style jsx>{`
        @keyframes scanLine {
          0% {
            top: 0;
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            top: 100%;
            opacity: 1;
          }
        }

        @keyframes scannerPulse {
          0% {
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
            border-color: #4CAF50;
          }
          50% {
            box-shadow: 0 0 40px rgba(76, 175, 80, 0.6);
            border-color: #8BC34A;
          }
          100% {
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
            border-color: #4CAF50;
          }
        }

        @keyframes slidePattern {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Legacy scanner frame styles for compatibility */
        .scanner-frame {
          width: 200px;
          height: 200px;
          border: 2px solid #28a745;
          border-radius: 10px;
          position: relative;
          margin: 0 auto;
        }

        .scanner-frame::before,
        .scanner-frame::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 3px solid #28a745;
        }

        .scanner-frame::before {
          top: -3px;
          left: -3px;
          border-right: none;
          border-bottom: none;
        }

        .scanner-frame::after {
          bottom: -3px;
          right: -3px;
          border-left: none;
          border-top: none;
        }

        .scanner-line {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #28a745, transparent);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }

        .scanning-overlay {
          text-align: center;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
