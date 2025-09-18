import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import QRScanner from '../../components/consumer/QRScanner';
import SupplyChainJourney from '../../components/consumer/SupplyChainJourney';
import ProductSearch from '../../components/consumer/ProductSearch';

const ConsumerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  // Simulate API call to fetch consumer dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock consumer dashboard data
        const mockData = {
          verificationStats: {
            totalScans: 24,
            verifiedProducts: 22,
            suspiciousProducts: 2,
            trustedBrands: 8
          },
          recentVerifications: [
            { 
              id: 'VER-2024-045', 
              product: 'Ashwagandha Capsules', 
              brand: 'Ayur Pharma', 
              batchId: 'BATCH-F-2024-012', 
              status: 'Verified', 
              date: '2024-09-15',
              farmer: 'Rajesh Kumar',
              location: 'Rishikesh, UK'
            },
            { 
              id: 'VER-2024-046', 
              product: 'Tulsi Extract', 
              brand: 'Natural Herbs Co.', 
              batchId: 'BATCH-F-2024-013', 
              status: 'Verified', 
              date: '2024-09-14',
              farmer: 'Sunita Devi',
              location: 'Haridwar, UK'
            },
            { 
              id: 'VER-2024-047', 
              product: 'Brahmi Oil', 
              brand: 'Pure Ayurveda', 
              batchId: 'BATCH-F-2024-014', 
              status: 'Warning', 
              date: '2024-09-13',
              farmer: 'Unknown',
              location: 'Not Available'
            }
          ],
          savedProducts: [
            { id: 1, name: 'Ashwagandha Capsules', brand: 'Ayur Pharma', lastVerified: '2024-09-15', status: 'Verified' },
            { id: 2, name: 'Tulsi Tea', brand: 'Herbal Bliss', lastVerified: '2024-09-10', status: 'Verified' },
            { id: 3, name: 'Triphala Powder', brand: 'Natural Herbs', lastVerified: '2024-09-08', status: 'Verified' }
          ],
          trustedFarms: [
            { name: 'Green Valley Herbs Farm', location: 'Rishikesh, Uttarakhand', rating: 4.8, products: 12 },
            { name: 'Organic Ayur Farm', location: 'Haridwar, Uttarakhand', rating: 4.6, products: 8 },
            { name: 'Pure Herb Gardens', location: 'Dehradun, Uttarakhand', rating: 4.9, products: 15 }
          ],
          healthTips: [
            'Always verify products before consumption using AyurTrace QR scanner.',
            'Check the herb source location and farm details for authenticity.',
            'Look for Grade A quality herbs for maximum benefits.',
            'Store herbs in cool, dry places to maintain their potency.'
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching consumer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle QR Scanner
  const handleScanSuccess = (batchId) => {
    setSelectedBatchId(batchId);
    setShowScanner(false);
    setShowJourney(true);
  };

  const handleScanError = (error) => {
    console.error('Scan error:', error);
    // Could show a toast or alert here
  };

  // Handle Journey View
  const handleViewJourney = (batchId) => {
    setSelectedBatchId(batchId);
    setShowJourney(true);
  };

  // Handle Product Selection from Search
  const handleProductSelect = (product) => {
    setSelectedBatchId(product.batchId);
    setShowProductSearch(false);
    setShowJourney(true);
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading consumer dashboard..." />;
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">Consumer Dashboard</h1>
              <p className="text-muted mb-0">Welcome back, {user?.name}! Verify authentic Ayurvedic products.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={() => setShowScanner(true)}>
                <i className="fas fa-qrcode me-2"></i>
                Scan QR Code
              </button>
              <button className="btn btn-outline-primary" onClick={() => setShowProductSearch(true)}>
                <i className="fas fa-search me-2"></i>
                Verify Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-start border-primary border-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">
                    Total Scans
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.verificationStats.totalScans}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-qrcode fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-start border-success border-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">
                    Verified Products
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.verificationStats.verifiedProducts}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-shield-check fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-start border-warning border-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1">
                    Suspicious Items
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.verificationStats.suspiciousProducts}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-exclamation-triangle fa-2x text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-start border-info border-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-info text-uppercase mb-1">
                    Trusted Brands
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.verificationStats.trustedBrands}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-award fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Verifications */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">Recent Verifications</h6>
              <button className="btn btn-sm btn-outline-primary">View All</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Status</th>
                      <th>Farmer</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentVerifications.map(verification => (
                      <tr key={verification.id}>
                        <td>
                          <strong>{verification.product}</strong>
                          <br />
                          <code className="small">{verification.batchId}</code>
                        </td>
                        <td>{verification.brand}</td>
                        <td>
                          <span className={`badge bg-${
                            verification.status === 'Verified' ? 'success' :
                            verification.status === 'Warning' ? 'warning' : 'danger'
                          }`}>
                            {verification.status === 'Verified' && <i className="fas fa-check me-1"></i>}
                            {verification.status === 'Warning' && <i className="fas fa-exclamation-triangle me-1"></i>}
                            {verification.status}
                          </span>
                        </td>
                        <td>
                          {verification.farmer !== 'Unknown' ? (
                            <div>
                              <div>{verification.farmer}</div>
                              <small className="text-muted">{verification.location}</small>
                            </div>
                          ) : (
                            <em className="text-muted">Not Available</em>
                          )}
                        </td>
                        <td className="text-muted">{verification.date}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleViewJourney(verification.batchId)}
                          >
                            <i className="fas fa-route"></i> Journey
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Scan & Health Tips */}
        <div className="col-xl-4 col-lg-5">
          {/* Quick Scanner */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Quick Product Scanner</h6>
            </div>
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-qrcode fa-4x text-success mb-3"></i>
              </div>
              <p className="text-muted mb-3">
                Scan QR code on your Ayurvedic product to verify authenticity and view complete supply chain journey.
              </p>
              <button className="btn btn-success btn-lg w-100 mb-2" onClick={() => setShowScanner(true)}>
                <i className="fas fa-camera me-2"></i>
                Open Scanner
              </button>
              <button className="btn btn-outline-primary w-100" onClick={() => setShowScanner(true)}>
                <i className="fas fa-keyboard me-2"></i>
                Enter Batch ID
              </button>
            </div>
          </div>

          {/* Health Tips */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Health & Safety Tips</h6>
            </div>
            <div className="card-body">
              {dashboardData?.healthTips.map((tip, index) => (
                <div key={index} className="d-flex align-items-start mb-3">
                  <div className="text-success me-3">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <small className="text-muted">{tip}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Products */}
      <div className="row">
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">My Saved Products</h6>
            </div>
            <div className="card-body">
              {dashboardData?.savedProducts.map(product => (
                <div key={product.id} className="d-flex align-items-center justify-content-between p-3 mb-2 bg-light rounded">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{product.name}</h6>
                    <div className="d-flex align-items-center">
                      <small className="text-muted me-3">{product.brand}</small>
                      <span className={`badge bg-${
                        product.status === 'Verified' ? 'success' : 'warning'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <small className="text-muted">Last verified: {product.lastVerified}</small>
                  </div>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trusted Farms */}
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Trusted Farms</h6>
            </div>
            <div className="card-body">
              {dashboardData?.trustedFarms.map((farm, index) => (
                <div key={index} className="d-flex align-items-center justify-content-between p-3 mb-2 bg-light rounded">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      {farm.name}
                      <span className="ms-2">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < Math.floor(farm.rating) ? 'text-warning' : 'text-muted'}`}
                          ></i>
                        ))}
                        <small className="text-muted ms-1">({farm.rating})</small>
                      </span>
                    </h6>
                    <small className="text-muted">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {farm.location}
                    </small>
                    <br />
                    <small className="text-success">
                      <i className="fas fa-leaf me-1"></i>
                      {farm.products} verified products
                    </small>
                  </div>
                  <button className="btn btn-sm btn-outline-success">
                    <i className="fas fa-eye"></i> View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-success w-100 py-3" onClick={() => setShowScanner(true)}>
                    <i className="fas fa-qrcode fa-2x mb-2"></i><br />
                    Scan QR Code
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-primary w-100 py-3" onClick={() => setShowProductSearch(true)}>
                    <i className="fas fa-search fa-2x mb-2"></i><br />
                    Search Products
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info w-100 py-3">
                    <i className="fas fa-history fa-2x mb-2"></i><br />
                    My History
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning w-100 py-3">
                    <i className="fas fa-flag fa-2x mb-2"></i><br />
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScanSuccess}
          onError={handleScanError}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Supply Chain Journey Modal */}
      {showJourney && selectedBatchId && (
        <SupplyChainJourney
          batchId={selectedBatchId}
          onClose={() => {
            setShowJourney(false);
            setSelectedBatchId(null);
          }}
        />
      )}

      {/* Product Search Modal */}
      {showProductSearch && (
        <ProductSearch
          onClose={() => setShowProductSearch(false)}
          onSelectProduct={handleProductSelect}
        />
      )}
    </div>
  );
};

export default ConsumerDashboard;
