import React, { useState, useEffect } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';
import localStorageManager from '../../utils/localStorage';

const ProductVerification = ({ initialData, onVerified, onScanRequest }) => {
  const [formData, setFormData] = useState({
    productId: '',
    batchId: '',
    manufacturingId: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMode, setVerificationMode] = useState('product'); // 'product', 'batch', 'manufacturing'

  useEffect(() => {
    if (initialData) {
      // Auto-fill form based on scanned data
      if (initialData.productId) {
        setFormData(prev => ({ ...prev, productId: initialData.productId }));
        setVerificationMode('product');
      } else if (initialData.batchId) {
        setFormData(prev => ({ ...prev, batchId: initialData.batchId }));
        setVerificationMode('batch');
      } else if (initialData.manufacturingId) {
        setFormData(prev => ({ ...prev, manufacturingId: initialData.manufacturingId }));
        setVerificationMode('manufacturing');
      }
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setVerificationResult(null); // Clear previous results when input changes
  };

  const verifyProduct = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      let result = null;

      if (verificationMode === 'product' && formData.productId) {
        // Verify product
        const products = localStorageManager.getProducts();
        const product = products.find(p => p.id === formData.productId);
        
        if (product) {
          // Get related batch and manufacturing data
          const batch = localStorageManager.getBatches().find(b => b.id === product.batchId);
          const manufacturingRecord = localStorageManager.getManufacturingRecordByBatchId(product.batchId);
          const supplyChainJourney = localStorageManager.getSupplyChainJourney(product.batchId);

          result = {
            type: 'product',
            status: 'verified',
            confidence: 98.5,
            product,
            batch,
            manufacturingRecord,
            supplyChainJourney,
            verificationDate: new Date().toISOString(),
            blockchainVerified: true
          };
        } else {
          result = {
            type: 'product',
            status: 'not_found',
            confidence: 0,
            message: 'Product not found in our database. This may be a counterfeit product.',
            verificationDate: new Date().toISOString(),
            blockchainVerified: false
          };
        }
      } else if (verificationMode === 'batch' && formData.batchId) {
        // Verify batch
        const batches = localStorageManager.getBatches();
        const batch = batches.find(b => b.id === formData.batchId);
        
        if (batch) {
          const manufacturingRecord = localStorageManager.getManufacturingRecordByBatchId(batch.id);
          const supplyChainJourney = localStorageManager.getSupplyChainJourney(batch.id);

          result = {
            type: 'batch',
            status: 'verified',
            confidence: 96.8,
            batch,
            manufacturingRecord,
            supplyChainJourney,
            verificationDate: new Date().toISOString(),
            blockchainVerified: true
          };
        } else {
          result = {
            type: 'batch',
            status: 'not_found',
            confidence: 0,
            message: 'Batch not found in our database.',
            verificationDate: new Date().toISOString(),
            blockchainVerified: false
          };
        }
      } else if (verificationMode === 'manufacturing' && formData.manufacturingId) {
        // Verify manufacturing record
        const manufacturingRecords = localStorageManager.getManufacturingRecords();
        const manufacturingRecord = manufacturingRecords.find(r => r.id === formData.manufacturingId);
        
        if (manufacturingRecord) {
          const batch = localStorageManager.getBatches().find(b => b.id === manufacturingRecord.batchId);
          const supplyChainJourney = localStorageManager.getSupplyChainJourney(manufacturingRecord.batchId);

          result = {
            type: 'manufacturing',
            status: 'verified',
            confidence: 94.2,
            manufacturingRecord,
            batch,
            supplyChainJourney,
            verificationDate: new Date().toISOString(),
            blockchainVerified: true
          };
        } else {
          result = {
            type: 'manufacturing',
            status: 'not_found',
            confidence: 0,
            message: 'Manufacturing record not found in our database.',
            verificationDate: new Date().toISOString(),
            blockchainVerified: false
          };
        }
      }

      setVerificationResult(result);

      // If verification successful, record this verification
      if (result && result.status === 'verified') {
        const verificationRecord = {
          consumerId: 'consumer_' + Date.now(),
          type: result.type,
          targetId: verificationMode === 'product' ? formData.productId : 
                   verificationMode === 'batch' ? formData.batchId : formData.manufacturingId,
          batchId: result.batch?.id || result.manufacturingRecord?.batchId,
          productId: result.product?.id,
          status: 'verified',
          confidence: result.confidence,
          location: 'Consumer Location', // This would be from geolocation in real app
          userAgent: navigator.userAgent,
          ipAddress: '192.168.1.100' // This would be actual IP in real app
        };

        localStorageManager.addVerification(verificationRecord);
        
        // Call onVerified callback with the full result
        onVerified(result);
      }

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Verification error:', error);
      setVerificationResult({
        type: verificationMode,
        status: 'error',
        confidence: 0,
        message: 'Verification failed. Please try again.',
        verificationDate: new Date().toISOString(),
        blockchainVerified: false
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerificationModeLabel = (mode) => {
    switch (mode) {
      case 'product': return 'Product ID';
      case 'batch': return 'Batch ID';
      case 'manufacturing': return 'Manufacturing ID';
      default: return 'ID';
    }
  };

  const getCurrentInputValue = () => {
    switch (verificationMode) {
      case 'product': return formData.productId;
      case 'batch': return formData.batchId;
      case 'manufacturing': return formData.manufacturingId;
      default: return '';
    }
  };

  const handleCurrentInputChange = (value) => {
    const field = verificationMode === 'product' ? 'productId' : 
                  verificationMode === 'batch' ? 'batchId' : 'manufacturingId';
    handleInputChange(field, value);
  };

  const renderVerificationResult = () => {
    if (!verificationResult) return null;

    const isVerified = verificationResult.status === 'verified';
    const bgColor = isVerified ? colorPalette.success.light : colorPalette.error.light;
    const borderColor = isVerified ? colorPalette.success.main : colorPalette.error.main;
    const textColor = isVerified ? colorPalette.success.dark : colorPalette.error.dark;

    return (
      <div style={{
        background: bgColor,
        borderRadius: '15px',
        padding: '25px',
        marginTop: '25px',
        border: `2px solid ${borderColor}40`,
        animation: 'fadeInUp 0.5s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            fontSize: '32px',
            marginRight: '15px'
          }}>
            {isVerified ? '✅' : '❌'}
          </div>
          <div>
            <h6 style={{
              margin: '0 0 5px 0',
              color: textColor,
              fontSize: '18px',
              fontWeight: '700'
            }}>
              {isVerified ? 'Product Verified!' : 'Verification Failed'}
            </h6>
            <p style={{
              margin: 0,
              color: colorPalette.neutral[600],
              fontSize: '14px'
            }}>
              {isVerified ? 
                `Confidence Score: ${verificationResult.confidence}% • Blockchain Secured` :
                verificationResult.message
              }
            </p>
          </div>
        </div>

        {isVerified && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '15px'
          }}>
            <h6 style={{
              margin: '0 0 15px 0',
              color: colorPalette.neutral[800],
              fontSize: '16px',
              fontWeight: '600'
            }}>
              📋 Verification Details
            </h6>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              fontSize: '13px'
            }}>
              <div>
                <strong>Verification Type:</strong><br />
                <span style={{ color: colorPalette.neutral[600] }}>
                  {verificationResult.type.charAt(0).toUpperCase() + verificationResult.type.slice(1)}
                </span>
              </div>
              
              {verificationResult.product && (
                <>
                  <div>
                    <strong>Product:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>
                      {verificationResult.product.productName}
                    </span>
                  </div>
                  <div>
                    <strong>Manufacturer:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>
                      {verificationResult.product.manufacturerName}
                    </span>
                  </div>
                </>
              )}

              {verificationResult.batch && (
                <>
                  <div>
                    <strong>Herb Type:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>
                      {verificationResult.batch.crop}
                    </span>
                  </div>
                  <div>
                    <strong>Farmer:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>
                      {verificationResult.batch.farmerName}
                    </span>
                  </div>
                  <div>
                    <strong>Location:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>
                      {verificationResult.batch.location}
                    </span>
                  </div>
                </>
              )}

              {verificationResult.manufacturingRecord && (
                <>
                  <div>
                    <strong>Process:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>
                      {verificationResult.manufacturingRecord.process}
                    </span>
                  </div>
                  <div>
                    <strong>Facility:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>
                      {verificationResult.manufacturingRecord.facilityName}
                    </span>
                  </div>
                </>
              )}

              <div>
                <strong>Verification Date:</strong><br />
                <span style={{ color: colorPalette.neutral[600] }}>
                  {new Date(verificationResult.verificationDate).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {isVerified && verificationResult.supplyChainJourney && (
          <div style={{
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <button
              onClick={() => onVerified(verificationResult)}
              style={{
                background: getGradient('primary'),
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: shadows.md
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🛤️ View Complete Supply Chain Journey
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
      padding: '35px'
    }}>
      <div className="consumer-portal-content">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h5 style={{
            margin: '0 0 10px 0',
            color: colorPalette.neutral[800],
            fontSize: '20px',
            fontWeight: '700'
          }}>
            🔍 Product Verification
          </h5>
          <p style={{
            margin: 0,
            color: colorPalette.neutral[600],
            fontSize: '14px'
          }}>
            Enter product information manually or scan a QR code to verify authenticity
          </p>
        </div>

        {/* Verification Mode Selection */}
        <div style={{
          background: colorPalette.neutral[50],
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px',
          border: `1px solid ${colorPalette.neutral[200]}`
        }}>
          <h6 style={{
            color: colorPalette.neutral[700],
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📋 What would you like to verify?
          </h6>
          
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {['product', 'batch', 'manufacturing'].map((mode) => (
              <button
                key={mode}
                onClick={() => setVerificationMode(mode)}
                style={{
                  background: verificationMode === mode ? getGradient('primary') : 'white',
                  color: verificationMode === mode ? 'white' : colorPalette.neutral[600],
                  border: `2px solid ${verificationMode === mode ? 'transparent' : colorPalette.neutral[300]}`,
                  borderRadius: '10px',
                  padding: '12px 18px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (verificationMode !== mode) {
                    e.currentTarget.style.borderColor = colorPalette.primary[300];
                    e.currentTarget.style.background = colorPalette.primary[50];
                  }
                }}
                onMouseLeave={(e) => {
                  if (verificationMode !== mode) {
                    e.currentTarget.style.borderColor = colorPalette.neutral[300];
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                {mode === 'product' && '📦'} 
                {mode === 'batch' && '🌿'} 
                {mode === 'manufacturing' && '🏭'}
                {getVerificationModeLabel(mode)}
              </button>
            ))}
          </div>
        </div>

        {/* QR Scanner Button */}
        <div style={{
          background: colorPalette.primary[50],
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px',
          border: `1px solid ${colorPalette.primary[200]}`,
          textAlign: 'center'
        }}>
          <button
            onClick={onScanRequest}
            style={{
              background: getGradient('secondary'),
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
              gap: '10px',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📱 Scan QR Code
          </button>
          <p style={{
            margin: '15px 0 0 0',
            color: colorPalette.neutral[600],
            fontSize: '13px'
          }}>
            Or enter the {getVerificationModeLabel(verificationMode).toLowerCase()} manually below
          </p>
        </div>

        {/* Manual Input Form */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          border: `2px solid ${colorPalette.neutral[200]}`,
          marginBottom: '25px'
        }}>
          <h6 style={{
            color: colorPalette.neutral[700],
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            ✏️ Manual Entry
          </h6>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: colorPalette.neutral[700]
            }}>
              {getVerificationModeLabel(verificationMode)} *
            </label>
            <input
              type="text"
              value={getCurrentInputValue()}
              onChange={(e) => handleCurrentInputChange(e.target.value)}
              placeholder={`Enter ${getVerificationModeLabel(verificationMode).toLowerCase()} (e.g., ${
                verificationMode === 'product' ? 'PROD-M-2024-001' :
                verificationMode === 'batch' ? 'BATCH-F-2024-012' :
                'MFG-2024-001'
              })`}
              style={{
                width: '100%',
                padding: '15px 18px',
                borderRadius: '12px',
                border: `2px solid ${colorPalette.primary[200]}`,
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.primary[400]}
              onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.primary[200]}
            />
          </div>

          <button
            onClick={verifyProduct}
            disabled={!getCurrentInputValue() || isVerifying}
            style={{
              background: isVerifying || !getCurrentInputValue() ? 
                colorPalette.neutral[400] : getGradient('primary'),
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isVerifying || !getCurrentInputValue() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isVerifying || !getCurrentInputValue() ? 'none' : shadows.md,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            {isVerifying ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Verifying on Blockchain...
              </>
            ) : (
              <>
                ✅ Verify Product
              </>
            )}
          </button>
        </div>

        {/* Verification Result */}
        {renderVerificationResult()}

        {/* Sample IDs for Testing */}
        <div style={{
          background: colorPalette.warning[50],
          borderRadius: '15px',
          padding: '20px',
          marginTop: '25px',
          border: `1px solid ${colorPalette.warning.main}40`
        }}>
          <h6 style={{
            color: colorPalette.warning.dark,
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🧪 Test with Sample IDs
          </h6>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            fontSize: '13px'
          }}>
            <div>
              <strong>Product IDs:</strong><br />
              <span style={{ color: colorPalette.neutral[600], fontFamily: 'monospace' }}>
                PROD-M-2024-001
              </span>
            </div>
            <div>
              <strong>Batch IDs:</strong><br />
              <span style={{ color: colorPalette.neutral[600], fontFamily: 'monospace' }}>
                BATCH-F-2024-012<br />
                BATCH-F-2024-015
              </span>
            </div>
            <div>
              <strong>Manufacturing IDs:</strong><br />
              <span style={{ color: colorPalette.neutral[600], fontFamily: 'monospace' }}>
                MFG-2024-001
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductVerification;
