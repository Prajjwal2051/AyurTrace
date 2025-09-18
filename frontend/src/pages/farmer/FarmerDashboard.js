import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard';
import SupplyChainMap from '../../components/mapping/SupplyChainMap';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  // Simulate API call to fetch farmer dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock farmer dashboard data
        const mockData = {
          farmStats: {
            totalBatches: 48,
            activeBatches: 12,
            harvestedBatches: 36,
            totalRevenue: 145000
          },
          recentBatches: [
            { id: 'BATCH-F-2024-012', herb: 'Ashwagandha', quantity: '500 kg', quality: 'A', status: 'Harvested', date: '2024-09-15', buyer: 'Ayur Pharma' },
            { id: 'BATCH-F-2024-013', herb: 'Tulsi', quantity: '300 kg', quality: 'A', status: 'Growing', date: '2024-09-10', buyer: 'Pending' },
            { id: 'BATCH-F-2024-014', herb: 'Brahmi', quantity: '250 kg', quality: 'B', status: 'Processing', date: '2024-09-08', buyer: 'Natural Extracts' },
            { id: 'BATCH-F-2024-015', herb: 'Neem', quantity: '400 kg', quality: 'A', status: 'Harvested', date: '2024-09-05', buyer: 'Green Pharma' }
          ],
          seasonalData: {
            currentSeason: 'Monsoon',
            recommendedHerbs: ['Tulsi', 'Brahmi', 'Neem'],
            weatherAlert: 'Heavy rainfall expected in next 3 days',
            soilCondition: 'Good - High moisture content'
          },
          qualityDistribution: {
            gradeA: 32,
            gradeB: 12,
            gradeC: 4
          },
          monthlyEarnings: [
            { month: 'Jan', amount: 18000 },
            { month: 'Feb', amount: 22000 },
            { month: 'Mar', amount: 25000 },
            { month: 'Apr', amount: 19000 },
            { month: 'May', amount: 28000 },
            { month: 'Jun', amount: 33000 }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching farmer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading farmer dashboard..." />;
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">Farmer Dashboard</h1>
              <p className="text-muted mb-0">Welcome back, {user?.name}! Farm: {user?.farmName}</p>
            </div>
            <div className="d-flex gap-2">
              <div className="btn-group me-2" role="group">
                <button 
                  className={`btn ${activeView === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveView('dashboard')}
                >
                  <i className="fas fa-tachometer-alt me-1"></i>
                  Farm Overview
                </button>
                <button 
                  className={`btn ${activeView === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveView('analytics')}
                >
                  <i className="fas fa-chart-line me-1"></i>
                  Analytics
                </button>
                <button 
                  className={`btn ${activeView === 'map' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveView('map')}
                >
                  <i className="fas fa-map me-1"></i>
                  Location View
                </button>
              </div>
              <button className="btn btn-success">
                <i className="fas fa-plus me-2"></i>
                Add New Batch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alert */}
      {dashboardData?.seasonalData.weatherAlert && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning" role="alert">
              <i className="fas fa-cloud-rain me-2"></i>
              <strong>Weather Alert:</strong> {dashboardData.seasonalData.weatherAlert}
            </div>
          </div>
        </div>
      )}

      {/* Conditional View Rendering */}
      {activeView === 'analytics' && (
        <div className="mt-4">
          <AnalyticsDashboard userRole="farmer" />
        </div>
      )}

      {activeView === 'map' && (
        <div className="mt-4">
          <SupplyChainMap viewMode="farmer" />
        </div>
      )}

      {activeView === 'dashboard' && (
        <>
      {/* Farm Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-start border-primary border-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">
                    Total Batches
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.farmStats.totalBatches}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-seedling fa-2x text-success"></i>
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
                    Active Batches
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.farmStats.activeBatches}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-leaf fa-2x text-success"></i>
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
                    Harvested
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.farmStats.harvestedBatches}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-tractor fa-2x text-success"></i>
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
                    Total Revenue
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    ₹{dashboardData?.farmStats.totalRevenue.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-rupee-sign fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Batches */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">Recent Batches</h6>
              <button className="btn btn-sm btn-outline-primary">View All</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Batch ID</th>
                      <th>Herb</th>
                      <th>Quantity</th>
                      <th>Quality</th>
                      <th>Status</th>
                      <th>Buyer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentBatches.map(batch => (
                      <tr key={batch.id}>
                        <td>
                          <code>{batch.id}</code>
                        </td>
                        <td>
                          <strong>{batch.herb}</strong>
                        </td>
                        <td>{batch.quantity}</td>
                        <td>
                          <span className={`badge bg-${
                            batch.quality === 'A' ? 'success' :
                            batch.quality === 'B' ? 'warning' : 'secondary'
                          }`}>
                            Grade {batch.quality}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${
                            batch.status === 'Harvested' ? 'success' :
                            batch.status === 'Growing' ? 'primary' :
                            batch.status === 'Processing' ? 'warning' : 'secondary'
                          }`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="text-muted">
                          {batch.buyer === 'Pending' ? (
                            <em>Pending</em>
                          ) : (
                            batch.buyer
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Farm Information */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Farm Information</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-calendar-alt text-success me-2"></i>
                  <span className="fw-bold">Current Season</span>
                </div>
                <span className="badge bg-info">{dashboardData?.seasonalData.currentSeason}</span>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-eye text-success me-2"></i>
                  <span className="fw-bold">Soil Condition</span>
                </div>
                <p className="text-muted mb-0">{dashboardData?.seasonalData.soilCondition}</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-star text-success me-2"></i>
                  <span className="fw-bold">Recommended Herbs</span>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {dashboardData?.seasonalData.recommendedHerbs.map(herb => (
                    <span key={herb} className="badge bg-success">{herb}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-chart-pie text-success me-2"></i>
                  <span className="fw-bold">Quality Distribution</span>
                </div>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="text-success">
                      <div className="h4 mb-0">{dashboardData?.qualityDistribution.gradeA}</div>
                      <small>Grade A</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-warning">
                      <div className="h4 mb-0">{dashboardData?.qualityDistribution.gradeB}</div>
                      <small>Grade B</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-secondary">
                      <div className="h4 mb-0">{dashboardData?.qualityDistribution.gradeC}</div>
                      <small>Grade C</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Monthly Earnings (₹)</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                {dashboardData?.monthlyEarnings.map(data => (
                  <div key={data.month} className="col-md-2 mb-3">
                    <div className="card border-0 bg-light">
                      <div className="card-body py-2">
                        <div className="text-muted small">{data.month}</div>
                        <div className="h6 mb-0 text-success">₹{data.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <button className="btn btn-outline-success w-100 py-3">
                    <i className="fas fa-plus-circle fa-2x mb-2"></i><br />
                    Create New Batch
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-primary w-100 py-3">
                    <i className="fas fa-eye fa-2x mb-2"></i><br />
                    View All Batches
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info w-100 py-3">
                    <i className="fas fa-chart-line fa-2x mb-2"></i><br />
                    Analytics
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning w-100 py-3">
                    <i className="fas fa-user-edit fa-2x mb-2"></i><br />
                    Farm Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default FarmerDashboard;
