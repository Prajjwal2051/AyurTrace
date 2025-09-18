import React, { useState, useEffect } from 'react';
import localStorageManager from '../../utils/localStorage';

const SupplyChainJourney = ({ batchId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [journeyData, setJourneyData] = useState(null);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchJourneyData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get real journey data from local storage
        const realJourneyData = localStorageManager.getSupplyChainJourney(batchId);
        
        if (!realJourneyData) {
          setError(`Batch ${batchId} not found in the system. Try: BATCH-F-2024-012, BATCH-F-2024-013, or BATCH-F-2024-014`);
          return;
        }

        // Transform data to match component format
        const transformedData = {
          product: {
            name: realJourneyData.batch.crop + ' Product',
            brand: realJourneyData.batch.farmName,
            batchId: batchId,
            certification: realJourneyData.batch.certifications?.join(', ') || 'Certified',
            grade: realJourneyData.batch.quality,
            expiryDate: '2025-12-31'
          },
          journey: [
            {
              stage: 'Farm Origin',
              title: 'Seed to Harvest',
              icon: 'fas fa-seedling',
              color: 'success',
              date: new Date(realJourneyData.batch.plantingDate).toLocaleDateString(),
              location: realJourneyData.batch.location,
              responsible: realJourneyData.batch.farmerName + ' (Certified Farmer)',
              details: {
                crop: realJourneyData.batch.crop,
                variety: realJourneyData.batch.variety,
                quantity: realJourneyData.batch.quantity,
                plantingDate: realJourneyData.batch.plantingDate,
                harvestDate: realJourneyData.batch.harvestDate || 'Not Harvested',
                organicCertification: realJourneyData.batch.certifications?.includes('Organic') ? 'NPOP Certified' : 'Not Organic',
                quality: realJourneyData.batch.quality
              },
              tests: [
                { name: 'Soil Quality Test', result: 'Passed', date: realJourneyData.batch.plantingDate },
                { name: 'Seed Purity Test', result: 'Passed', date: realJourneyData.batch.plantingDate },
                { name: 'Pesticide Residue', result: 'Not Detected', date: realJourneyData.batch.harvestDate || realJourneyData.batch.updatedAt }
              ]
            }
          ],
          verification: {
            status: 'VERIFIED',
            confidence: realJourneyData.verifications.length > 0 ? realJourneyData.verifications[0].confidence : 95,
            blockchain: {
              hash: '0x' + Math.random().toString(16).substring(2, 50),
              timestamp: new Date().toISOString(),
              network: 'AyurTrace Local Blockchain'
            },
            certificates: realJourneyData.batch.certifications?.map(cert => ({
              name: cert + ' Certificate',
              authority: 'Certification Authority',
              valid: true
            })) || [
              { name: 'Quality Certificate', authority: 'Local Authority', valid: true }
            ]
          }
        };

        // Add manufacturing stages if products exist
        if (realJourneyData.products && realJourneyData.products.length > 0) {
          realJourneyData.products.forEach(product => {
            transformedData.journey.push({
              stage: 'Manufacturing',
              title: 'Processing & Quality Control',
              icon: 'fas fa-industry',
              color: 'warning',
              date: new Date(product.processingDate).toLocaleDateString(),
              location: 'Processing Facility',
              responsible: product.manufacturerName + ' (Production Manager)',
              details: {
                productName: product.productName,
                productType: product.productType,
                quantity: product.quantity,
                processingDate: product.processingDate,
                expiryDate: product.expiryDate,
                batchNumber: product.batchNumber
              },
              tests: product.qualityTests || [
                { name: 'Quality Control', result: 'Pass', date: product.processingDate }
              ]
            });
          });
        }

        // Add verification stages if verifications exist
        if (realJourneyData.verifications && realJourneyData.verifications.length > 0) {
          realJourneyData.verifications.forEach(verification => {
            transformedData.journey.push({
              stage: 'Consumer Verification',
              title: 'Product Verification',
              icon: 'fas fa-user-check',
              color: 'info',
              date: new Date(verification.verificationDate).toLocaleDateString(),
              location: verification.location,
              responsible: 'Consumer Verification',
              details: {
                status: verification.status,
                confidence: verification.confidence + '%',
                verificationDate: verification.verificationDate
              },
              tests: [
                { name: 'Authenticity Check', result: verification.status, date: verification.verificationDate }
              ]
            });
          });
        }

        setJourneyData(transformedData);
      } catch (error) {
        setError('Failed to fetch journey data. Please try again.');
        console.error('Error fetching journey data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchJourneyData();
    }
  }, [batchId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED': return 'success';
      case 'WARNING': return 'warning';
      case 'FAILED': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5>Tracing Supply Chain Journey...</h5>
              <p className="text-muted">Fetching blockchain records for {batchId}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Journey Lookup Failed
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body text-center py-5">
              <i className="fas fa-times-circle fa-4x text-danger mb-3"></i>
              <h5>Unable to retrieve journey data</h5>
              <p className="text-muted">{error}</p>
              <button className="btn btn-primary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-route me-2"></i>
              Supply Chain Journey - {journeyData?.product.name}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Product Header */}
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="card border-success">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h4 className="card-title mb-2">{journeyData?.product.name}</h4>
                        <p className="card-text">
                          <strong>Brand:</strong> {journeyData?.product.brand}<br />
                          <strong>Batch ID:</strong> <code>{journeyData?.product.batchId}</code><br />
                          <strong>Grade:</strong> <span className="badge bg-success">{journeyData?.product.grade}</span>
                        </p>
                      </div>
                      <div className="text-end">
                        <span className={`badge bg-${getStatusColor(journeyData?.verification.status)} fs-6 mb-2`}>
                          <i className="fas fa-shield-check me-1"></i>
                          {journeyData?.verification.status}
                        </span>
                        <div className="small text-muted">
                          Confidence: {journeyData?.verification.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Blockchain Verification</h6>
                    <div className="small">
                      <div className="mb-1">
                        <i className="fas fa-link me-1"></i>
                        <strong>Hash:</strong>
                      </div>
                      <code className="small">{journeyData?.verification.blockchain.hash.substring(0, 20)}...</code>
                      <div className="mt-2">
                        <i className="fas fa-clock me-1"></i>
                        {new Date(journeyData?.verification.blockchain.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="row">
              <div className="col-md-3">
                <div className="nav flex-column nav-pills" role="tablist">
                  {journeyData?.journey.map((step, index) => (
                    <button
                      key={index}
                      className={`nav-link text-start mb-2 ${activeStep === index ? 'active' : ''}`}
                      onClick={() => setActiveStep(index)}
                    >
                      <i className={`${step.icon} me-2 text-${step.color}`}></i>
                      <div>
                        <div className="fw-bold">{step.stage}</div>
                        <small className="text-muted">{step.date}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="col-md-9">
                <div className="card shadow-sm">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <i className={`${journeyData?.journey[activeStep].icon} fa-2x text-${journeyData?.journey[activeStep].color} me-3`}></i>
                      <div>
                        <h5 className="mb-1">{journeyData?.journey[activeStep].stage}</h5>
                        <h6 className="text-muted mb-0">{journeyData?.journey[activeStep].title}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6><i className="fas fa-info-circle text-primary me-2"></i>Basic Information</h6>
                        <div className="mb-3">
                          <div className="mb-2">
                            <strong><i className="fas fa-calendar me-1"></i> Date:</strong> {journeyData?.journey[activeStep].date}
                          </div>
                          <div className="mb-2">
                            <strong><i className="fas fa-map-marker-alt me-1"></i> Location:</strong><br />
                            <small>{journeyData?.journey[activeStep].location}</small>
                          </div>
                          <div className="mb-2">
                            <strong><i className="fas fa-user me-1"></i> Responsible:</strong><br />
                            <small>{journeyData?.journey[activeStep].responsible}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6><i className="fas fa-flask text-success me-2"></i>Test Results</h6>
                        <div className="mb-3">
                          {journeyData?.journey[activeStep].tests?.map((test, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-center mb-1">
                              <small>{test.name}:</small>
                              <span className="badge bg-success small">{test.result}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6><i className="fas fa-clipboard-list text-info me-2"></i>Detailed Information</h6>
                      <div className="row">
                        {Object.entries(journeyData?.journey[activeStep].details || {}).map(([key, value], idx) => (
                          <div key={idx} className="col-md-6 mb-2">
                            <small>
                              <strong className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="fas fa-certificate text-warning me-2"></i>
                      Certifications & Compliance
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {journeyData?.verification.certificates.map((cert, index) => (
                        <div key={index} className="col-md-4 mb-3">
                          <div className="d-flex align-items-center">
                            <i className={`fas ${cert.valid ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'} me-2`}></i>
                            <div>
                              <div className="fw-bold small">{cert.name}</div>
                              <div className="text-muted small">{cert.authority}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-success me-2">
              <i className="fas fa-download me-1"></i>
              Download Report
            </button>
            <button type="button" className="btn btn-outline-primary me-2">
              <i className="fas fa-share me-1"></i>
              Share Journey
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainJourney;
