import React, { useState, useEffect } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';
import localStorageManager from '../../utils/localStorage';

const HerbProcessingForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    batchId: '',
    manufacturingProcess: '',
    facilityName: '',
    qualityTestResults: '',
    processingDate: new Date().toISOString().split('T')[0],
    expectedYield: '',
    processingNotes: ''
  });
  
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedBatchDetails, setSelectedBatchDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);

  const manufacturingProcesses = [
    'Drying & Dehydration',
    'Grinding & Powdering', 
    'Extract Preparation',
    'Oil Extraction',
    'Tablet Formation',
    'Capsule Filling',
    'Liquid Preparation',
    'Quality Testing',
    'Packaging',
    'Standardization'
  ];

  const qualityTestOptions = [
    'Excellent - All parameters passed',
    'Good - Minor variations within limits',
    'Average - Some parameters at threshold',
    'Below Standard - Requires re-processing'
  ];

  // Load available herb batches from farmers
  useEffect(() => {
    const loadAvailableBatches = () => {
      setIsLoadingBatches(true);
      try {
        // Get all batches that are ready for manufacturing (from farmers)
        const manufacturingReadyBatches = localStorageManager.getBatchesForProcessing();
        
        setAvailableBatches(manufacturingReadyBatches);
      } catch (error) {
        console.error('Error loading batches:', error);
      } finally {
        setIsLoadingBatches(false);
      }
    };

    loadAvailableBatches();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // If batch ID is selected, load batch details
    if (field === 'batchId' && value) {
      const batchDetails = availableBatches.find(batch => batch.id === value);
      setSelectedBatchDetails(batchDetails);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    const requiredFields = ['batchId', 'manufacturingProcess', 'facilityName', 'qualityTestResults'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate blockchain hash for the record
      const recordData = {
        batchId: formData.batchId,
        process: formData.manufacturingProcess,
        facility: formData.facilityName,
        timestamp: Date.now()
      };
      const blockchainHash = localStorageManager.generateBlockchainHash(recordData);
      
      // Create manufacturing record
      const manufacturingRecord = {
        batchId: formData.batchId,
        manufacturerId: 'MFG-001', // Mock manufacturer ID
        manufacturerName: 'Ayur Manufacturing Ltd.',
        facilityName: formData.facilityName,
        process: formData.manufacturingProcess,
        qualityTestResult: formData.qualityTestResults,
        expectedYield: formData.expectedYield,
        processingNotes: formData.processingNotes,
        processingDate: formData.processingDate,
        status: 'Processing',
        blockchainHash: blockchainHash
      };

      // Update the original batch status
      if (selectedBatchDetails) {
        localStorageManager.updateBatch(selectedBatchDetails.id, { status: 'Under Manufacturing' });
      }
      
      // Save manufacturing record
      const success = localStorageManager.addManufacturingRecord(manufacturingRecord);
      
      if (!success) {
        throw new Error('Failed to save manufacturing record');
      }
      
      // Call the onSubmit callback
      onSubmit(manufacturingRecord);
      
      // Reset form
      setFormData({
        batchId: '',
        manufacturingProcess: '',
        facilityName: '',
        qualityTestResults: '',
        processingDate: new Date().toISOString().split('T')[0],
        expectedYield: '',
        processingNotes: ''
      });
      setSelectedBatchDetails(null);
      
    } catch (error) {
      console.error('Error submitting manufacturing data:', error);
      alert('Failed to process herb batch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: colorPalette.glass.white,
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: shadows.xl,
        border: `1px solid ${colorPalette.glass.border}`
      }}>
        {/* Header */}
        <div style={{
          background: getGradient('secondary'),
          padding: '25px 35px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              🏭 Process Herb Batch
            </h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              Transform harvested herbs into processed products
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div style={{ padding: '35px', maxHeight: 'calc(90vh - 140px)', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit}>
            
            {/* Available Herb Batches Section */}
            <div style={{ 
              background: colorPalette.primary[50], 
              borderRadius: '15px', 
              padding: '20px', 
              marginBottom: '25px',
              border: `1px solid ${colorPalette.primary[200]}`
            }}>
              <h6 style={{ 
                color: colorPalette.primary[700], 
                marginBottom: '15px', 
                fontSize: '16px',
                fontWeight: '600'
              }}>
                📋 Available Herb Batches
              </h6>
              
              {isLoadingBatches ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: `2px solid ${colorPalette.primary[200]}`,
                    borderTop: `2px solid ${colorPalette.primary[500]}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <p style={{ marginTop: '10px', color: colorPalette.neutral[600] }}>Loading batches...</p>
                </div>
              ) : availableBatches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ color: colorPalette.neutral[500], margin: 0 }}>
                    No herb batches available for processing
                  </p>
                </div>
              ) : (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: colorPalette.neutral[700] 
                  }}>
                    Select Batch ID *
                  </label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => handleInputChange('batchId', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: `2px solid ${colorPalette.primary[200]}`,
                      fontSize: '14px',
                      background: 'white',
                      transition: 'border-color 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.primary[500]}
                    onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.primary[200]}
                    required
                  >
                    <option value="">Select a batch to process</option>
                    {availableBatches.map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.id} - {batch.crop} ({batch.quantity}) - Grade {batch.quality?.slice(-1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Selected Batch Details */}
            {selectedBatchDetails && (
              <div style={{ 
                background: colorPalette.success.light, 
                borderRadius: '15px', 
                padding: '20px', 
                marginBottom: '25px',
                border: `1px solid ${colorPalette.success.main}40`
              }}>
                <h6 style={{ 
                  color: colorPalette.success.dark, 
                  marginBottom: '15px', 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  🌿 Selected Batch Details
                </h6>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <strong>Herb Type:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>{selectedBatchDetails.crop}</span>
                  </div>
                  <div>
                    <strong>Quantity:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>{selectedBatchDetails.quantity}</span>
                  </div>
                  <div>
                    <strong>Quality:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>{selectedBatchDetails.quality}</span>
                  </div>
                  <div>
                    <strong>Farmer:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>{selectedBatchDetails.farmerName || 'Farm Owner'}</span>
                  </div>
                  <div>
                    <strong>Location:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>{selectedBatchDetails.location || 'Farm Location'}</span>
                  </div>
                  <div>
                    <strong>Harvest Date:</strong><br />
                    <span style={{ color: colorPalette.neutral[600] }}>
                      {selectedBatchDetails.harvestDate ? 
                        new Date(selectedBatchDetails.harvestDate).toLocaleDateString() : 
                        new Date(selectedBatchDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              {/* Manufacturing Process */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: colorPalette.neutral[700] 
                }}>
                  🔄 Manufacturing Process *
                </label>
                <select
                  value={formData.manufacturingProcess}
                  onChange={(e) => handleInputChange('manufacturingProcess', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `2px solid ${colorPalette.secondary[200]}`,
                    fontSize: '14px',
                    background: 'white',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[500]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[200]}
                  required
                >
                  <option value="">Select Process</option>
                  {manufacturingProcesses.map(process => (
                    <option key={process} value={process}>{process}</option>
                  ))}
                </select>
              </div>

              {/* Processing Date */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: colorPalette.neutral[700] 
                }}>
                  📅 Processing Date *
                </label>
                <input
                  type="date"
                  value={formData.processingDate}
                  onChange={(e) => handleInputChange('processingDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `2px solid ${colorPalette.secondary[200]}`,
                    fontSize: '14px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[500]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[200]}
                  required
                />
              </div>
            </div>

            {/* Manufacturing Facility */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: colorPalette.neutral[700] 
              }}>
                🏭 Manufacturing Facility *
              </label>
              <input
                type="text"
                value={formData.facilityName}
                onChange={(e) => handleInputChange('facilityName', e.target.value)}
                placeholder="Enter facility name/location"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `2px solid ${colorPalette.secondary[200]}`,
                  fontSize: '14px',
                  transition: 'border-color 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[500]}
                onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[200]}
                required
              />
            </div>

            {/* Row: Quality Test Results and Expected Yield */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px' }}>
              {/* Quality Test Results */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: colorPalette.neutral[700] 
                }}>
                  🧪 Quality Test Results *
                </label>
                <select
                  value={formData.qualityTestResults}
                  onChange={(e) => handleInputChange('qualityTestResults', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `2px solid ${colorPalette.secondary[200]}`,
                    fontSize: '14px',
                    background: 'white',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[500]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[200]}
                  required
                >
                  <option value="">Select Test Results</option>
                  {qualityTestOptions.map(result => (
                    <option key={result} value={result}>{result}</option>
                  ))}
                </select>
              </div>

              {/* Expected Yield */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: colorPalette.neutral[700] 
                }}>
                  📊 Expected Yield
                </label>
                <input
                  type="text"
                  value={formData.expectedYield}
                  onChange={(e) => handleInputChange('expectedYield', e.target.value)}
                  placeholder="e.g., 80%"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `2px solid ${colorPalette.neutral[300]}`,
                    fontSize: '14px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[400]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.neutral[300]}
                />
              </div>
            </div>

            {/* Processing Notes */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: colorPalette.neutral[700] 
              }}>
                📝 Processing Notes
              </label>
              <textarea
                value={formData.processingNotes}
                onChange={(e) => handleInputChange('processingNotes', e.target.value)}
                placeholder="Additional processing details, observations, or special handling instructions..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `2px solid ${colorPalette.neutral[300]}`,
                  fontSize: '14px',
                  resize: 'vertical',
                  transition: 'border-color 0.3s ease',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.secondary[400]}
                onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.neutral[300]}
              />
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: colorPalette.neutral[200],
                  border: 'none',
                  color: colorPalette.neutral[700],
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colorPalette.neutral[300]}
                onMouseLeave={(e) => e.currentTarget.style.background = colorPalette.neutral[200]}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? colorPalette.neutral[400] : getGradient('secondary'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 30px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSubmitting ? 'none' : shadows.md,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Processing & Updating Chain...
                  </>
                ) : (
                  <>
                    🏭 Process & Update Chain
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HerbProcessingForm;
