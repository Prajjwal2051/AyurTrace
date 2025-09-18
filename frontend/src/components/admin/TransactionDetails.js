import React, { useState } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';
import localStorageManager from '../../utils/localStorage';

const TransactionDetails = ({ transaction, onBack }) => {
  const [showRawData, setShowRawData] = useState(false);

  if (!transaction) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
        <h5 style={{ marginBottom: '10px' }}>No Transaction Selected</h5>
        <p style={{ color: colorPalette.neutral[600] }}>
          Please select a transaction to view its details
        </p>
        <button
          onClick={onBack}
          style={{
            marginTop: '20px',
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
        >
          ← Back to Ledger
        </button>
      </div>
    );
  }

  const getTransactionTypeInfo = (type) => {
    const types = {
      'batch_creation': {
        icon: '🌱',
        color: colorPalette.success.main,
        label: 'Batch Creation',
        description: 'New herb batch registered on blockchain',
        category: 'Farming'
      },
      'manufacturing': {
        icon: '🏭',
        color: colorPalette.warning.main,
        label: 'Manufacturing',
        description: 'Processing and manufacturing operations',
        category: 'Manufacturing'
      },
      'product_creation': {
        icon: '📦',
        color: colorPalette.info.main,
        label: 'Product Creation',
        description: 'Final product registered and packaged',
        category: 'Manufacturing'
      },
      'verification': {
        icon: '✅',
        color: colorPalette.primary.main,
        label: 'Verification',
        description: 'Consumer product verification',
        category: 'Consumer'
      },
      'quality_test': {
        icon: '🧪',
        color: colorPalette.secondary.main,
        label: 'Quality Test',
        description: 'Quality testing and certification',
        category: 'Quality Assurance'
      },
      'transfer': {
        icon: '🔄',
        color: colorPalette.neutral[500],
        label: 'Transfer',
        description: 'Ownership or custody transfer',
        category: 'Transfer'
      }
    };
    return types[type] || types['transfer'];
  };

  const getTransactionStatus = (tx) => {
    const now = Date.now();
    const txTime = new Date(tx.timestamp).getTime();
    const ageMinutes = (now - txTime) / (1000 * 60);

    if (ageMinutes < 5) return { status: 'recent', label: 'New', color: colorPalette.success.main };
    if (ageMinutes < 60) return { status: 'pending', label: 'Processing', color: colorPalette.warning.main };
    return { status: 'confirmed', label: 'Confirmed', color: colorPalette.primary.main };
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const typeInfo = getTransactionTypeInfo(transaction.type);
  const status = getTransactionStatus(transaction);

  // Get related data
  const getRelatedData = () => {
    const related = {};
    
    if (transaction.batchId) {
      const batch = localStorageManager.getBatches().find(b => b.id === transaction.batchId);
      if (batch) related.batch = batch;
    }
    
    if (transaction.productId) {
      const product = localStorageManager.getProducts().find(p => p.id === transaction.productId);
      if (product) related.product = product;
    }
    
    if (transaction.manufacturingId) {
      const mfgRecord = localStorageManager.getManufacturingRecords().find(r => r.id === transaction.manufacturingId);
      if (mfgRecord) related.manufacturing = mfgRecord;
    }

    return related;
  };

  const relatedData = getRelatedData();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add toast notification here
    });
  };

  const renderDataField = (label, value, copyable = false) => {
    if (!value) return null;
    
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: '15px',
        alignItems: 'start',
        marginBottom: '12px',
        padding: '12px',
        background: colorPalette.neutral[50],
        borderRadius: '8px'
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: colorPalette.neutral[700]
        }}>
          {label}:
        </div>
        <div style={{
          fontSize: '14px',
          color: colorPalette.neutral[800],
          fontFamily: copyable ? 'monospace' : 'inherit',
          wordBreak: 'break-all',
          position: 'relative'
        }}>
          {value}
          {copyable && (
            <button
              onClick={() => copyToClipboard(value)}
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                color: colorPalette.primary[500],
                cursor: 'pointer',
                fontSize: '12px'
              }}
              title="Copy to clipboard"
            >
              📋
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: colorPalette.neutral[200],
            border: 'none',
            color: colorPalette.neutral[700],
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = colorPalette.neutral[300]}
          onMouseLeave={(e) => e.currentTarget.style.background = colorPalette.neutral[200]}
        >
          ← Back to Ledger
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            background: status.color,
            color: 'white',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {status.label}
          </div>
          <div style={{
            background: typeInfo.color,
            color: 'white',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {typeInfo.category}
          </div>
        </div>
      </div>

      {/* Transaction Overview */}
      <div style={{
        background: getGradient('card'),
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        border: `2px solid ${typeInfo.color}40`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: `linear-gradient(45deg, transparent, ${typeInfo.color}10, transparent)`,
          animation: 'shimmer 3s ease-in-out infinite',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '20px',
          alignItems: 'start',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            background: `${typeInfo.color}20`,
            borderRadius: '20px',
            padding: '20px',
            fontSize: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {typeInfo.icon}
          </div>

          <div>
            <h4 style={{
              margin: '0 0 10px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: colorPalette.neutral[800]
            }}>
              {typeInfo.label}
            </h4>
            <p style={{
              margin: '0 0 15px 0',
              fontSize: '16px',
              color: colorPalette.neutral[600]
            }}>
              {typeInfo.description}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontSize: '14px',
              color: colorPalette.neutral[500]
            }}>
              <div>
                <strong>Timestamp:</strong> {formatTimestamp(transaction.timestamp)}
              </div>
              {transaction.blockNumber && (
                <div>
                  <strong>Block:</strong> #{transaction.blockNumber}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px',
        border: `1px solid ${colorPalette.neutral[200]}`
      }}>
        <h6 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: colorPalette.neutral[800]
        }}>
          📋 Transaction Information
        </h6>

        {renderDataField('Hash', transaction.hash, true)}
        {renderDataField('Type', transaction.type)}
        {renderDataField('From', transaction.from)}
        {renderDataField('To', transaction.to)}
        {renderDataField('Batch ID', transaction.batchId, true)}
        {renderDataField('Product ID', transaction.productId, true)}
        {renderDataField('Manufacturing ID', transaction.manufacturingId, true)}
        {renderDataField('Value', transaction.value)}
        {renderDataField('Gas Used', transaction.gasUsed)}
        {renderDataField('Gas Price', transaction.gasPrice)}
        {renderDataField('Nonce', transaction.nonce)}
        {renderDataField('Block Number', transaction.blockNumber)}
        {renderDataField('Transaction Index', transaction.transactionIndex)}
        
        {transaction.description && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            background: colorPalette.primary[50],
            borderRadius: '10px',
            borderLeft: `4px solid ${typeInfo.color}`
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: colorPalette.neutral[700],
              marginBottom: '8px'
            }}>
              Description:
            </div>
            <div style={{
              fontSize: '14px',
              color: colorPalette.neutral[800],
              lineHeight: '1.5'
            }}>
              {transaction.description}
            </div>
          </div>
        )}
      </div>

      {/* Related Data */}
      {(relatedData.batch || relatedData.product || relatedData.manufacturing) && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '25px',
          border: `1px solid ${colorPalette.neutral[200]}`
        }}>
          <h6 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: colorPalette.neutral[800]
          }}>
            🔗 Related Information
          </h6>

          {relatedData.batch && (
            <div style={{
              background: colorPalette.success[50],
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '15px',
              border: `1px solid ${colorPalette.success.main}40`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '20px' }}>🌱</span>
                <h6 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: colorPalette.success.dark
                }}>
                  Batch Information
                </h6>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div><strong>Crop:</strong> {relatedData.batch.crop}</div>
                <div><strong>Farmer:</strong> {relatedData.batch.farmerName}</div>
                <div><strong>Location:</strong> {relatedData.batch.location}</div>
                <div><strong>Quality:</strong> {relatedData.batch.quality}</div>
                <div><strong>Quantity:</strong> {relatedData.batch.quantity}</div>
                <div><strong>Status:</strong> {relatedData.batch.status}</div>
              </div>
            </div>
          )}

          {relatedData.product && (
            <div style={{
              background: colorPalette.info[50],
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '15px',
              border: `1px solid ${colorPalette.info.main}40`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '20px' }}>📦</span>
                <h6 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: colorPalette.info.dark
                }}>
                  Product Information
                </h6>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div><strong>Name:</strong> {relatedData.product.productName}</div>
                <div><strong>Type:</strong> {relatedData.product.productType}</div>
                <div><strong>Manufacturer:</strong> {relatedData.product.manufacturerName}</div>
                <div><strong>Quantity:</strong> {relatedData.product.quantity}</div>
                <div><strong>Status:</strong> {relatedData.product.status}</div>
                <div><strong>Expiry:</strong> {relatedData.product.expiryDate}</div>
              </div>
            </div>
          )}

          {relatedData.manufacturing && (
            <div style={{
              background: colorPalette.warning[50],
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${colorPalette.warning.main}40`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '20px' }}>🏭</span>
                <h6 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: colorPalette.warning.dark
                }}>
                  Manufacturing Information
                </h6>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div><strong>Process:</strong> {relatedData.manufacturing.process}</div>
                <div><strong>Facility:</strong> {relatedData.manufacturing.facilityName}</div>
                <div><strong>Quality Test:</strong> {relatedData.manufacturing.qualityTestResult}</div>
                <div><strong>Expected Yield:</strong> {relatedData.manufacturing.expectedYield}</div>
                <div><strong>Status:</strong> {relatedData.manufacturing.status}</div>
                <div><strong>Processing Date:</strong> {relatedData.manufacturing.processingDate}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Raw Transaction Data */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        border: `1px solid ${colorPalette.neutral[200]}`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h6 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: colorPalette.neutral[800]
          }}>
            🔧 Technical Details
          </h6>
          <button
            onClick={() => setShowRawData(!showRawData)}
            style={{
              background: showRawData ? colorPalette.primary[100] : colorPalette.neutral[200],
              color: showRawData ? colorPalette.primary[700] : colorPalette.neutral[700],
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {showRawData ? 'Hide' : 'Show'} Raw Data
          </button>
        </div>

        {showRawData ? (
          <div style={{
            background: colorPalette.neutral[900],
            color: colorPalette.neutral[100],
            borderRadius: '10px',
            padding: '20px',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.5',
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            <pre>{JSON.stringify(transaction, null, 2)}</pre>
          </div>
        ) : (
          <div style={{
            background: colorPalette.neutral[50],
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            color: colorPalette.neutral[600]
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔒</div>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Raw transaction data is hidden for security. Click "Show Raw Data" to view.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          50% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) translateY(200%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionDetails;
