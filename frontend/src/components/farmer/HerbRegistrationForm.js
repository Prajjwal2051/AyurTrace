import React, { useState } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';

const HerbRegistrationForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    herbType: '',
    farmerName: '',
    collectionLocation: '',
    coordinates: { lat: '', lng: '' },
    quantity: '',
    harvestDate: new Date().toISOString().split('T')[0],
    qualityGrade: '',
    additionalNotes: ''
  });
  
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const herbTypes = [
    'Ashwagandha', 'Brahmi', 'Tulsi', 'Neem', 'Turmeric', 
    'Ginger', 'Aloe Vera', 'Amla', 'Arjuna', 'Giloy',
    'Shatavari', 'Triphala', 'Guduchi', 'Moringa', 'Fenugreek'
  ];

  const qualityGrades = [
    { value: 'A', label: 'Grade A - Premium Quality' },
    { value: 'B', label: 'Grade B - Good Quality' },
    { value: 'C', label: 'Grade C - Standard Quality' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6)
          }
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    const requiredFields = ['herbType', 'farmerName', 'collectionLocation', 'quantity', 'harvestDate', 'qualityGrade'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the onSubmit callback with form data
      onSubmit({
        ...formData,
        id: `BATCH-F-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        status: 'Registered',
        createdAt: new Date().toISOString(),
        blockchainHash: `0x${Math.random().toString(16).substr(2, 64)}`
      });
      
      // Reset form
      setFormData({
        herbType: '',
        farmerName: '',
        collectionLocation: '',
        coordinates: { lat: '', lng: '' },
        quantity: '',
        harvestDate: new Date().toISOString().split('T')[0],
        qualityGrade: '',
        additionalNotes: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to register herb batch. Please try again.');
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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: shadows.xl,
        border: `1px solid ${colorPalette.glass.border}`
      }}>
        {/* Header */}
        <div style={{
          background: getGradient('primary'),
          padding: '25px 35px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              🌿 Register New Herb Batch
            </h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              Add herbs to the blockchain supply chain
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
            {/* Row 1: Herb Type and Farmer Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              {/* Herb Type */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: colorPalette.neutral[700] 
                }}>
                  Herb Type *
                </label>
                <select
                  value={formData.herbType}
                  onChange={(e) => handleInputChange('herbType', e.target.value)}
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
                  <option value="">Select Herb</option>
                  {herbTypes.map(herb => (
                    <option key={herb} value={herb}>{herb}</option>
                  ))}
                </select>
              </div>

              {/* Farmer Name */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: colorPalette.neutral[700] 
                }}>
                  Farmer Name *
                </label>
                <input
                  type="text"
                  value={formData.farmerName}
                  onChange={(e) => handleInputChange('farmerName', e.target.value)}
                  placeholder="Enter farmer name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `2px solid ${colorPalette.primary[200]}`,
                    fontSize: '14px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.primary[500]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.primary[200]}
                  required
                />
              </div>
            </div>

            {/* Collection Location */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: colorPalette.neutral[700] 
              }}>
                Collection Location *
              </label>
              <input
                type="text"
                value={formData.collectionLocation}
                onChange={(e) => handleInputChange('collectionLocation', e.target.value)}
                placeholder="Village, District, State"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `2px solid ${colorPalette.primary[200]}`,
                  fontSize: '14px',
                  transition: 'border-color 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.primary[500]}
                onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.primary[200]}
                required
              />
            </div>

            {/* GPS Coordinates */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: colorPalette.neutral[700] 
              }}>
                📍 Geo-coordinates: Click 'Get Location' to fetch GPS coordinates
              </label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                  <input
                    type="text"
                    value={formData.coordinates.lat}
                    onChange={(e) => handleInputChange('coordinates', {...formData.coordinates, lat: e.target.value})}
                    placeholder="Latitude"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: `2px solid ${colorPalette.neutral[300]}`,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    readOnly
                  />
                  <input
                    type="text"
                    value={formData.coordinates.lng}
                    onChange={(e) => handleInputChange('coordinates', {...formData.coordinates, lng: e.target.value})}
                    placeholder="Longitude"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: `2px solid ${colorPalette.neutral[300]}`,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    readOnly
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  style={{
                    background: isGettingLocation ? colorPalette.neutral[400] : getGradient('secondary'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isGettingLocation ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isGettingLocation ? '📍 Getting...' : 'Get Location'}
                </button>
              </div>
              {locationError && (
                <div style={{ color: colorPalette.error.main, fontSize: '12px', marginTop: '5px' }}>
                  {locationError}
                </div>
              )}
            </div>

            {/* Row 2: Quantity and Harvest Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              {/* Quantity */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: colorPalette.neutral[700] 
                }}>
                  Quantity (kg) *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="Enter quantity in kg"
                  min="0"
                  step="0.1"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `2px solid ${colorPalette.primary[200]}`,
                    fontSize: '14px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.primary[500]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.primary[200]}
                  required
                />
              </div>

              {/* Harvest Date */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: colorPalette.neutral[700] 
                }}>
                  Harvest Date *
                </label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: `2px solid ${colorPalette.primary[200]}`,
                    fontSize: '14px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.primary[500]}
                  onBlur={(e) => e.currentTarget.style.borderColor = colorPalette.primary[200]}
                  required
                />
              </div>
            </div>

            {/* Quality Grade */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: colorPalette.neutral[700] 
              }}>
                Quality Grade *
              </label>
              <select
                value={formData.qualityGrade}
                onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
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
                <option value="">Select Grade</option>
                {qualityGrades.map(grade => (
                  <option key={grade.value} value={grade.value}>{grade.label}</option>
                ))}
              </select>
            </div>

            {/* Additional Notes */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: colorPalette.neutral[700] 
              }}>
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any additional information about the herbs..."
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
                onFocus={(e) => e.currentTarget.style.borderColor = colorPalette.primary[400]}
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
                  background: isSubmitting ? colorPalette.neutral[400] : getGradient('primary'),
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
                    <div className="loading-spinner" style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Adding to Blockchain...
                  </>
                ) : (
                  <>
                    🔗 Add to Blockchain
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

export default HerbRegistrationForm;
