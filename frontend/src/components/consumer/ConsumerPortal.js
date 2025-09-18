import React, { useState } from 'react';
import { colorPalette, getGradient, shadows } from '../../styles/colorPalette';
import QRCodeScanner from './QRCodeScanner';
import ProductVerification from './ProductVerification';
import ProductJourney from './ProductJourney';

const ConsumerPortal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('verify');
  const [scannedData, setScannedData] = useState(null);
  const [verifiedProduct, setVerifiedProduct] = useState(null);

  const handleQRScan = (data) => {
    if (data) {
      setScannedData(data);
      setActiveTab('verify'); // Switch to verification tab
    }
  };

  const handleProductVerified = (product) => {
    setVerifiedProduct(product);
    setActiveTab('journey'); // Switch to journey tab after verification
  };

  const tabs = [
    { id: 'verify', label: 'Verify Product', icon: '🔍' },
    { id: 'scanner', label: 'QR Scanner', icon: '📱' },
    { id: 'journey', label: 'Supply Chain', icon: '🛤️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scanner':
        return (
          <QRCodeScanner
            onScan={handleQRScan}
            onClose={() => setActiveTab('verify')}
          />
        );
      case 'verify':
        return (
          <ProductVerification
            initialData={scannedData}
            onVerified={handleProductVerified}
            onScanRequest={() => setActiveTab('scanner')}
          />
        );
      case 'journey':
        return (
          <ProductJourney
            product={verifiedProduct}
            onBackToVerify={() => setActiveTab('verify')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
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
        maxWidth: '1000px',
        maxHeight: '95vh',
        overflow: 'hidden',
        boxShadow: shadows.xl,
        border: `1px solid ${colorPalette.glass.border}`,
        display: 'flex',
        flexDirection: 'column'
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
            <h4 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
              🛒 Consumer Verification Portal
            </h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '1rem', opacity: 0.9 }}>
              Verify product authenticity and trace supply chain journey
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: colorPalette.neutral[50],
          borderBottom: `1px solid ${colorPalette.neutral[200]}`,
          padding: '0 35px',
          display: 'flex',
          gap: '0'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'white' : 'transparent',
                border: 'none',
                padding: '15px 25px',
                borderRadius: activeTab === tab.id ? '15px 15px 0 0' : '0',
                color: activeTab === tab.id ? colorPalette.primary[600] : colorPalette.neutral[600],
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderBottom: activeTab === tab.id ? 'none' : `2px solid transparent`,
                marginBottom: activeTab === tab.id ? '-1px' : '0',
                boxShadow: activeTab === tab.id ? shadows.sm : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = colorPalette.neutral[100];
                  e.currentTarget.style.color = colorPalette.primary[500];
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colorPalette.neutral[600];
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          background: 'white'
        }}>
          {renderTabContent()}
        </div>

        {/* Status Bar */}
        <div style={{
          background: colorPalette.neutral[50],
          padding: '15px 35px',
          borderTop: `1px solid ${colorPalette.neutral[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: colorPalette.neutral[600]
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {scannedData && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: colorPalette.success.main }}>📱</span>
                <span>QR Data Scanned</span>
              </div>
            )}
            {verifiedProduct && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: colorPalette.success.main }}>✅</span>
                <span>Product Verified</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '10px' }}>🔒</span>
            <span>Blockchain Secured</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .consumer-portal-content {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConsumerPortal;
