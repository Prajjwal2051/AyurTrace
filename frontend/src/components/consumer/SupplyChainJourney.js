import React, { useState, useEffect } from 'react';

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
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock journey data based on batch ID
        const mockJourneyData = {
          product: {
            name: 'Ashwagandha Root Powder',
            brand: 'Pure Ayur Herbs',
            batchId: batchId,
            certification: 'Organic Certified',
            grade: 'Grade A Premium',
            expiryDate: '2025-03-15'
          },
          journey: [
            {
              stage: 'Farm Origin',
              title: 'Seed to Harvest',
              icon: 'fas fa-seedling',
              color: 'success',
              date: '2024-03-01',
              location: 'Green Valley Organic Farm, Rishikesh, Uttarakhand',
              responsible: 'Rajesh Kumar (Certified Farmer)',
              details: {
                seedVariety: 'Premium Ashwagandha Seeds (WS-3)',
                soilType: 'Organic Sandy Loam',
                plantingDate: '2024-03-01',
                harvestDate: '2024-08-15',
                organicCertification: 'NPOP Certified',
                weatherConditions: 'Optimal monsoon season',
                yieldQuality: 'Grade A - High Withanolide content (>2.5%)'
              },
              tests: [
                { name: 'Soil Quality Test', result: 'Passed', date: '2024-02-25' },
                { name: 'Seed Purity Test', result: 'Passed', date: '2024-02-28' },
                { name: 'Pesticide Residue', result: 'Not Detected', date: '2024-08-16' }
              ],
              images: ['farm-soil.jpg', 'ashwagandha-plants.jpg', 'harvest.jpg']
            },
            {
              stage: 'Quality Control',
              title: 'Initial Processing & Testing',
              icon: 'fas fa-microscope',
              color: 'info',
              date: '2024-08-16',
              location: 'Farm Processing Unit, Rishikesh',
              responsible: 'Dr. Sunita Sharma (Quality Controller)',
              details: {
                cleaningProcess: 'Triple washed and sundried',
                moistureContent: '8.2% (Optimal)',
                withanolideContent: '2.8% (Excellent)',
                ashContent: '3.1% (Within limits)',
                heavyMetals: 'Not detected',
                microbialCount: 'Within safe limits',
                foreignMatter: '<1% (Excellent)'
              },
              tests: [
                { name: 'Moisture Analysis', result: '8.2%', date: '2024-08-16' },
                { name: 'Active Compound Test', result: '2.8% Withanolides', date: '2024-08-17' },
                { name: 'Heavy Metals Test', result: 'Not Detected', date: '2024-08-17' },
                { name: 'Microbial Test', result: 'Safe Limits', date: '2024-08-18' }
              ]
            },
            {
              stage: 'Manufacturing',
              title: 'Processing & Packaging',
              icon: 'fas fa-industry',
              color: 'warning',
              date: '2024-08-20',
              location: 'Pure Ayur Processing Plant, Haridwar',
              responsible: 'Amit Verma (Production Manager)',
              details: {
                processMethod: 'Traditional Grinding + Modern Sieving',
                meshSize: '80 mesh (Ultra-fine powder)',
                batchSize: '500 kg',
                packagingDate: '2024-08-22',
                packagingMaterial: 'Food-grade HDPE containers',
                storageConditions: 'Cool, dry place <25°C, <65% RH',
                shelfLife: '24 months from packaging'
              },
              tests: [
                { name: 'Particle Size Analysis', result: '80 mesh', date: '2024-08-21' },
                { name: 'Final Product Analysis', result: 'Passed', date: '2024-08-22' },
                { name: 'Packaging Integrity', result: 'Passed', date: '2024-08-22' }
              ]
            },
            {
              stage: 'Distribution',
              title: 'Warehouse & Logistics',
              icon: 'fas fa-truck',
              color: 'primary',
              date: '2024-08-25',
              location: 'Central Distribution Hub, Delhi',
              responsible: 'Logistics Team - FastTrack Express',
              details: {
                warehouseConditions: 'Temperature controlled 20-25°C',
                distributionDate: '2024-08-25',
                transportMethod: 'Refrigerated truck',
                deliveryTime: '48 hours',
                trackingId: 'FT-2024-AYU-5621',
                distributorLicense: 'DL-AYUR-2024-156'
              },
              tests: [
                { name: 'Storage Temperature Log', result: '22°C Average', date: '2024-08-25' },
                { name: 'Packaging Condition', result: 'Excellent', date: '2024-08-25' }
              ]
            },
            {
              stage: 'Retail',
              title: 'Final Destination',
              icon: 'fas fa-store',
              color: 'success',
              date: '2024-08-27',
              location: 'Ayur Wellness Store, Mumbai',
              responsible: 'Retailer: Healthy Living Pvt Ltd',
              details: {
                receivedDate: '2024-08-27',
                storageCompliance: 'Yes - Climate controlled',
                retailLicense: 'MH-RET-2024-891',
                staffTraining: 'Ayurvedic Product Specialist',
                customerGuidance: 'Usage instructions provided',
                returnPolicy: '30-day quality guarantee'
              }
            }
          ],
          verification: {
            status: 'VERIFIED',
            confidence: 98,
            blockchain: {
              hash: '0x4a7b8c9d2e1f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
              timestamp: '2024-08-27T10:30:00Z',
              network: 'AyurTrace Blockchain'
            },
            certificates: [
              { name: 'Organic Certificate', authority: 'NPOP India', valid: true },
              { name: 'FSSAI License', authority: 'Food Safety Authority', valid: true },
              { name: 'GMP Certificate', authority: 'WHO-GMP', valid: true }
            ]
          }
        };

        setJourneyData(mockJourneyData);
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
