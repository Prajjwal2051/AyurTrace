import React, { useState, useRef, useEffect } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';

const QRCodeScanner = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [simulateMode, setSimulateMode] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Mock QR codes for simulation
  const mockQRCodes = [
    {
      id: 'PROD-M-2024-001',
      type: 'product',
      data: {
        productId: 'PROD-M-2024-001',
        batchId: 'BATCH-F-2024-012',
        productName: 'Ashwagandha Capsules',
        manufacturerName: 'Ayur Processing Co.',
        expiryDate: '2026-08-20'
      }
    },
    {
      id: 'BATCH-F-2024-015',
      type: 'batch',
      data: {
        batchId: 'BATCH-F-2024-015',
        crop: 'Turmeric',
        farmerName: 'Priya Patel',
        harvestDate: '2024-07-15'
      }
    },
    {
      id: 'MFG-2024-001',
      type: 'manufacturing',
      data: {
        manufacturingId: 'MFG-2024-001',
        batchId: 'BATCH-F-2024-012',
        process: 'Steam Distillation',
        facilityName: 'Ayur Processing Co. - Unit 1'
      }
    }
  ];

  useEffect(() => {
    return () => {
      // Clean up camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please enable camera permissions or use simulation mode.');
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = (qrCode) => {
    // Simulate scanning delay
    setTimeout(() => {
      onScan(qrCode.data);
    }, 1000);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Here you would normally use a QR code detection library
      // For now, we'll simulate a successful scan
      const mockData = mockQRCodes[0].data;
      onScan(mockData);
    }
  };

  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
      padding: '35px'
    }}>
      <div className="consumer-portal-content">
        {/* Scanner Mode Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '25px'
        }}>
          <div style={{
            background: colorPalette.neutral[100],
            borderRadius: '15px',
            padding: '5px',
            display: 'flex'
          }}>
            <button
              onClick={() => setSimulateMode(false)}
              style={{
                background: !simulateMode ? 'white' : 'transparent',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                color: !simulateMode ? colorPalette.primary[600] : colorPalette.neutral[600],
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: !simulateMode ? shadows.sm : 'none'
              }}
            >
              📱 Camera Scanner
            </button>
            <button
              onClick={() => setSimulateMode(true)}
              style={{
                background: simulateMode ? 'white' : 'transparent',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                color: simulateMode ? colorPalette.primary[600] : colorPalette.neutral[600],
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: simulateMode ? shadows.sm : 'none'
              }}
            >
              🔍 Simulate Scan
            </button>
          </div>
        </div>

        {simulateMode ? (
          // Simulation Mode
          <div>
            <div style={{
              background: colorPalette.warning.light,
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '25px',
              border: `1px solid ${colorPalette.warning.main}40`,
              textAlign: 'center'
            }}>
              <h6 style={{
                color: colorPalette.warning.dark,
                margin: '0 0 10px 0',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                🔍 QR Code Simulation Mode
              </h6>
              <p style={{
                color: colorPalette.neutral[600],
                margin: 0,
                fontSize: '14px'
              }}>
                Select a mock QR code to simulate scanning
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {mockQRCodes.map((qrCode) => (
                <div
                  key={qrCode.id}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '20px',
                    border: `2px solid ${colorPalette.primary[200]}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => simulateQRScan(qrCode)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colorPalette.primary[400];
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colorPalette.primary[200];
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      background: colorPalette.primary[100],
                      borderRadius: '10px',
                      padding: '10px',
                      marginRight: '15px',
                      fontSize: '24px'
                    }}>
                      📱
                    </div>
                    <div>
                      <h6 style={{
                        margin: '0 0 5px 0',
                        color: colorPalette.neutral[800],
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        {qrCode.type === 'product' ? '📦 Product QR' : 
                         qrCode.type === 'batch' ? '🌿 Batch QR' : '🏭 Manufacturing QR'}
                      </h6>
                      <p style={{
                        margin: 0,
                        color: colorPalette.neutral[600],
                        fontSize: '12px'
                      }}>
                        ID: {qrCode.id}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '13px',
                    color: colorPalette.neutral[600],
                    lineHeight: '1.4'
                  }}>
                    {qrCode.type === 'product' && (
                      <div>
                        <strong>Product:</strong> {qrCode.data.productName}<br />
                        <strong>Manufacturer:</strong> {qrCode.data.manufacturerName}
                      </div>
                    )}
                    {qrCode.type === 'batch' && (
                      <div>
                        <strong>Crop:</strong> {qrCode.data.crop}<br />
                        <strong>Farmer:</strong> {qrCode.data.farmerName}
                      </div>
                    )}
                    {qrCode.type === 'manufacturing' && (
                      <div>
                        <strong>Process:</strong> {qrCode.data.process}<br />
                        <strong>Facility:</strong> {qrCode.data.facilityName}
                      </div>
                    )}
                  </div>
                  
                  <div style={{
                    marginTop: '15px',
                    padding: '8px 12px',
                    background: colorPalette.success[50],
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: colorPalette.success.dark,
                    fontWeight: '600'
                  }}>
                    Click to Simulate Scan
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Camera Mode
          <div>
            <div style={{
              background: colorPalette.primary[50],
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '25px',
              border: `1px solid ${colorPalette.primary[200]}`,
              textAlign: 'center'
            }}>
              <h6 style={{
                color: colorPalette.primary[700],
                margin: '0 0 10px 0',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                📱 QR Code Camera Scanner
              </h6>
              <p style={{
                color: colorPalette.neutral[600],
                margin: 0,
                fontSize: '14px'
              }}>
                Point your camera at a QR code to scan product information
              </p>
            </div>

            {/* Camera Container */}
            <div style={{
              position: 'relative',
              background: '#000',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '25px',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {!isScanning && !error && (
                <div style={{
                  textAlign: 'center',
                  color: 'white',
                  padding: '40px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>📱</div>
                  <h6 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                    Camera Ready
                  </h6>
                  <p style={{ margin: 0, opacity: 0.8 }}>
                    Click "Start Camera" to begin scanning
                  </p>
                </div>
              )}

              {error && (
                <div style={{
                  textAlign: 'center',
                  color: colorPalette.error.main,
                  padding: '40px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
                  <h6 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                    Camera Access Error
                  </h6>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    {error}
                  </p>
                </div>
              )}

              {isScanning && (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    muted
                    playsInline
                  />
                  
                  {/* Scanning Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '200px',
                    height: '200px',
                    border: `3px solid ${colorPalette.success.main}`,
                    borderRadius: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '5px' }}>🎯</div>
                      Align QR Code
                    </div>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {/* Camera Controls */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              {!isScanning ? (
                <button
                  onClick={startCamera}
                  style={{
                    background: getGradient('primary'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '15px 30px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: shadows.md,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  📹 Start Camera
                </button>
              ) : (
                <>
                  <button
                    onClick={captureFrame}
                    style={{
                      background: getGradient('success'),
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '15px 30px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: shadows.md,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    📸 Scan QR Code
                  </button>
                  <button
                    onClick={stopCamera}
                    style={{
                      background: colorPalette.neutral[400],
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '15px 30px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ⏹️ Stop Camera
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: colorPalette.neutral[50],
          borderRadius: '15px',
          padding: '20px',
          marginTop: '25px',
          border: `1px solid ${colorPalette.neutral[200]}`
        }}>
          <h6 style={{
            color: colorPalette.neutral[700],
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📋 Instructions
          </h6>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            fontSize: '13px',
            color: colorPalette.neutral[600]
          }}>
            <div>
              <strong>📱 Camera Mode:</strong><br />
              Use your device's camera to scan real QR codes on product packaging
            </div>
            <div>
              <strong>🔍 Simulation Mode:</strong><br />
              Test the system with mock QR codes for demonstration purposes
            </div>
            <div>
              <strong>🎯 Scanning Tips:</strong><br />
              Hold the QR code steady and ensure good lighting for best results
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
