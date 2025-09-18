import React, { useState } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';

const ProductJourney = ({ product, onBackToVerify }) => {
  const [selectedStage, setSelectedStage] = useState(null);

  if (!product || !product.supplyChainJourney) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '35px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
          <h5 style={{
            margin: '0 0 10px 0',
            color: colorPalette.neutral[600],
            fontSize: '18px'
          }}>
            No Product Selected
          </h5>
          <p style={{
            margin: '0 0 20px 0',
            color: colorPalette.neutral[500],
            fontSize: '14px'
          }}>
            Verify a product first to view its supply chain journey
          </p>
          <button
            onClick={onBackToVerify}
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
          >
            🔍 Verify Product
          </button>
        </div>
      </div>
    );
  }

  const journey = product.supplyChainJourney.journey || [];
  const batch = product.batch;
  const manufacturingRecord = product.manufacturingRecord;

  const getStageIcon = (stage) => {
    switch (stage.stage) {
      case 'Farm Origin': return '🌱';
      case 'Manufacturing Process': return '🏭';
      case 'Product Creation': return '📦';
      case 'Consumer Verification': return '✅';
      default: return '📍';
    }
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'Completed': return colorPalette.success.main;
      case 'Processing': return colorPalette.warning.main;
      case 'Verified': return colorPalette.primary.main;
      default: return colorPalette.neutral[400];
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStageDetails = (stage) => {
    return (
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        marginTop: '15px',
        border: `2px solid ${colorPalette.primary[200]}`,
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <h6 style={{
          margin: '0 0 15px 0',
          color: colorPalette.neutral[800],
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {getStageIcon(stage)}
          {stage.stage} Details
        </h6>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          fontSize: '13px'
        }}>
          <div>
            <strong>Date:</strong><br />
            <span style={{ color: colorPalette.neutral[600] }}>
              {formatDate(stage.date)}
            </span>
          </div>
          
          <div>
            <strong>Location:</strong><br />
            <span style={{ color: colorPalette.neutral[600] }}>
              {stage.location}
            </span>
          </div>
          
          <div>
            <strong>Responsible Party:</strong><br />
            <span style={{ color: colorPalette.neutral[600] }}>
              {stage.responsible}
            </span>
          </div>
          
          <div>
            <strong>Status:</strong><br />
            <span style={{ 
              color: getStageColor(stage.status),
              fontWeight: '600'
            }}>
              {stage.status}
            </span>
          </div>
        </div>

        {stage.details && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            background: colorPalette.neutral[50],
            borderRadius: '10px'
          }}>
            <h6 style={{
              margin: '0 0 10px 0',
              color: colorPalette.neutral[700],
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Additional Information:
            </h6>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px',
              fontSize: '12px'
            }}>
              {Object.entries(stage.details).map(([key, value]) => (
                <div key={key}>
                  <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong><br />
                  <span style={{ color: colorPalette.neutral[600] }}>
                    {typeof value === 'string' && value.startsWith('0x') ? 
                      `${value.substring(0, 10)}...${value.substring(value.length - 6)}` : 
                      value
                    }
                  </span>
                </div>
              ))}
            </div>
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h5 style={{
              margin: '0 0 5px 0',
              color: colorPalette.neutral[800],
              fontSize: '20px',
              fontWeight: '700'
            }}>
              🛤️ Supply Chain Journey
            </h5>
            <p style={{
              margin: 0,
              color: colorPalette.neutral[600],
              fontSize: '14px'
            }}>
              Complete traceability from farm to consumer
            </p>
          </div>
          <button
            onClick={onBackToVerify}
            style={{
              background: colorPalette.neutral[200],
              border: 'none',
              color: colorPalette.neutral[700],
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colorPalette.neutral[300]}
            onMouseLeave={(e) => e.currentTarget.style.background = colorPalette.neutral[200]}
          >
            ← Back to Verify
          </button>
        </div>

        {/* Product Overview */}
        <div style={{
          background: getGradient('primary'),
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          color: 'white'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div>
              <h6 style={{
                margin: '0 0 10px 0',
                fontSize: '18px',
                fontWeight: '700',
                opacity: 0.9
              }}>
                {product.type === 'product' && product.product ? 
                  `📦 ${product.product.productName}` :
                  product.type === 'batch' && batch ?
                  `🌿 ${batch.crop} Batch` :
                  `🏭 Manufacturing Record`
                }
              </h6>
              <p style={{
                margin: '0 0 15px 0',
                fontSize: '14px',
                opacity: 0.8
              }}>
                {product.type === 'product' && product.product ? 
                  `Manufactured by ${product.product.manufacturerName}` :
                  product.type === 'batch' && batch ?
                  `Grown by ${batch.farmerName} in ${batch.location}` :
                  `Processed at ${manufacturingRecord?.facilityName}`
                }
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                fontSize: '12px',
                opacity: 0.9
              }}>
                <div>
                  <strong>Confidence:</strong> {product.confidence}%
                </div>
                <div>
                  <strong>Verified:</strong> {formatDate(product.verificationDate)}
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>
                  🔒 Blockchain Secured
                </div>
              </div>
            </div>
            
            {batch && (
              <div style={{
                textAlign: 'right',
                opacity: 0.9
              }}>
                <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                  <strong>Batch Quality:</strong> {batch.quality}
                </div>
                <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                  <strong>Quantity:</strong> {batch.quantity}
                </div>
                {batch.certifications && batch.certifications.length > 0 && (
                  <div style={{ fontSize: '11px' }}>
                    <strong>Certifications:</strong> {batch.certifications.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Journey Timeline */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          border: `1px solid ${colorPalette.neutral[200]}`
        }}>
          <h6 style={{
            margin: '0 0 25px 0',
            color: colorPalette.neutral[800],
            fontSize: '18px',
            fontWeight: '700'
          }}>
            📈 Supply Chain Timeline
          </h6>

          <div style={{
            position: 'relative'
          }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '20px',
              bottom: '20px',
              width: '3px',
              background: colorPalette.neutral[200],
              borderRadius: '2px'
            }}>
              {/* Progress Fill */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '70%', // Adjust based on completion
                background: getGradient('success'),
                borderRadius: '2px'
              }}></div>
            </div>

            {/* Timeline Items */}
            {journey.map((stage, index) => (
              <div key={index} style={{
                position: 'relative',
                paddingLeft: '60px',
                paddingBottom: index < journey.length - 1 ? '30px' : '0',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedStage(selectedStage === index ? null : index)}
              >
                {/* Timeline Node */}
                <div style={{
                  position: 'absolute',
                  left: '8px',
                  top: '8px',
                  width: '26px',
                  height: '26px',
                  background: getStageColor(stage.status),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: shadows.md,
                  border: '3px solid white'
                }}>
                  {index + 1}
                </div>

                {/* Stage Card */}
                <div style={{
                  background: selectedStage === index ? colorPalette.primary[50] : colorPalette.neutral[50],
                  borderRadius: '15px',
                  padding: '20px',
                  border: selectedStage === index ? 
                    `2px solid ${colorPalette.primary[300]}` : 
                    `1px solid ${colorPalette.neutral[200]}`,
                  transition: 'all 0.3s ease',
                  boxShadow: selectedStage === index ? shadows.md : shadows.sm
                }}
                onMouseEnter={(e) => {
                  if (selectedStage !== index) {
                    e.currentTarget.style.background = colorPalette.neutral[100];
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStage !== index) {
                    e.currentTarget.style.background = colorPalette.neutral[50];
                  }
                }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <h6 style={{
                      margin: 0,
                      color: colorPalette.neutral[800],
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      {getStageIcon(stage)} {stage.stage}
                    </h6>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{
                        background: getStageColor(stage.status),
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {stage.status}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: colorPalette.neutral[500]
                      }}>
                        {selectedStage === index ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    fontSize: '13px'
                  }}>
                    <div>
                      <strong>Date:</strong><br />
                      <span style={{ color: colorPalette.neutral[600] }}>
                        {formatDate(stage.date)}
                      </span>
                    </div>
                    <div>
                      <strong>Location:</strong><br />
                      <span style={{ color: colorPalette.neutral[600] }}>
                        {stage.location}
                      </span>
                    </div>
                    <div>
                      <strong>Responsible:</strong><br />
                      <span style={{ color: colorPalette.neutral[600] }}>
                        {stage.responsible}
                      </span>
                    </div>
                  </div>

                  {selectedStage === index && renderStageDetails(stage)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '25px'
        }}>
          <div style={{
            background: colorPalette.success[50],
            borderRadius: '15px',
            padding: '20px',
            border: `1px solid ${colorPalette.success.main}40`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
            <h6 style={{
              margin: '0 0 5px 0',
              color: colorPalette.success.dark,
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Verified Authentic
            </h6>
            <p style={{
              margin: 0,
              color: colorPalette.neutral[600],
              fontSize: '12px'
            }}>
              {product.confidence}% Confidence Score
            </p>
          </div>

          <div style={{
            background: colorPalette.primary[50],
            borderRadius: '15px',
            padding: '20px',
            border: `1px solid ${colorPalette.primary.main}40`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔗</div>
            <h6 style={{
              margin: '0 0 5px 0',
              color: colorPalette.primary.dark,
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Blockchain Secured
            </h6>
            <p style={{
              margin: 0,
              color: colorPalette.neutral[600],
              fontSize: '12px'
            }}>
              Tamper-proof Records
            </p>
          </div>

          <div style={{
            background: colorPalette.warning[50],
            borderRadius: '15px',
            padding: '20px',
            border: `1px solid ${colorPalette.warning.main}40`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
            <h6 style={{
              margin: '0 0 5px 0',
              color: colorPalette.warning.dark,
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Complete Journey
            </h6>
            <p style={{
              margin: 0,
              color: colorPalette.neutral[600],
              fontSize: '12px'
            }}>
              {journey.length} Tracked Stages
            </p>
          </div>
        </div>

        {/* Additional Actions */}
        <div style={{
          marginTop: '30px',
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            style={{
              background: getGradient('secondary'),
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: shadows.md,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📊 Download Certificate
          </button>
          
          <button
            style={{
              background: colorPalette.neutral[200],
              color: colorPalette.neutral[700],
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colorPalette.neutral[300];
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colorPalette.neutral[200];
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📤 Share Journey
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductJourney;
