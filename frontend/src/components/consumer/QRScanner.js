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
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-qrcode me-2"></i>
              Product Scanner
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Scanner Mode Toggle */}
            <div className="btn-group w-100 mb-4" role="group">
              <button
                type="button"
                className={`btn ${scanMode === 'camera' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setScanMode('camera')}
              >
                <i className="fas fa-camera me-2"></i>
                Camera Scanner
              </button>
              <button
                type="button"
                className={`btn ${scanMode === 'manual' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setScanMode('manual')}
              >
                <i className="fas fa-keyboard me-2"></i>
                Manual Entry
              </button>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {scanMode === 'camera' ? (
              <div className="text-center">
                <div className="scanner-container mb-4">
                  {!isScanning ? (
                    <div className="scanner-preview bg-light d-flex align-items-center justify-content-center" style={{ height: '300px', border: '2px dashed #dee2e6' }}>
                      <div className="text-center">
                        <i className="fas fa-camera fa-4x text-muted mb-3"></i>
                        <p className="text-muted">Click "Start Scanner" to begin scanning</p>
                      </div>
                    </div>
                  ) : (
                    <div className="scanner-active bg-dark d-flex align-items-center justify-content-center" style={{ height: '300px', position: 'relative' }}>
                      <div className="scanning-overlay">
                        <div className="scanner-frame">
                          <div className="scanner-line"></div>
                        </div>
                        <p className="text-white mt-3">Position QR code within the frame</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 justify-content-center">
                  {!isScanning ? (
                    <button
                      className="btn btn-success btn-lg px-4"
                      onClick={startScanning}
                    >
                      <i className="fas fa-play me-2"></i>
                      Start Scanner
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-danger px-4"
                        onClick={stopScanning}
                      >
                        <i className="fas fa-stop me-2"></i>
                        Stop
                      </button>
                      <button
                        className="btn btn-success px-4"
                        onClick={simulateSuccessfulScan}
                      >
                        <i className="fas fa-check me-2"></i>
                        Simulate Success
                      </button>
                      <button
                        className="btn btn-warning px-4"
                        onClick={simulateFailedScan}
                      >
                        <i className="fas fa-times me-2"></i>
                        Simulate Failure
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Hold your device steady and ensure good lighting for best results
                  </small>
                </div>
              </div>
            ) : (
              <div>
                <form onSubmit={handleManualSubmit}>
                  <div className="mb-3">
                    <label htmlFor="manualBatchId" className="form-label">
                      <i className="fas fa-barcode me-2"></i>
                      Enter Batch ID or QR Code Data
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="manualBatchId"
                      placeholder="BATCH-F-2024-XXX"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      style={{ fontFamily: 'monospace' }}
                    />
                    <div className="form-text">
                      Expected format: BATCH-[F/M/A]-YYYY-NNN (e.g., BATCH-F-2024-001)
                    </div>
                  </div>
                  
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="fas fa-search me-2"></i>
                      Verify Product
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <h6 className="text-muted mb-3">Sample Batch IDs for Testing:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      'BATCH-F-2024-012',
                      'BATCH-F-2024-013',
                      'BATCH-M-2024-001',
                      'BATCH-F-2024-014'
                    ].map(batchId => (
                      <button
                        key={batchId}
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setManualInput(batchId)}
                      >
                        {batchId}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {scanMode === 'camera' && (
              <div className="text-muted small">
                <i className="fas fa-mobile-alt me-1"></i>
                Camera access required for scanning
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scanner CSS Styles */}
      <style jsx>{`
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
