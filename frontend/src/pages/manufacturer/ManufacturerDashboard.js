import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManufacturerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Simulate API call to fetch manufacturer dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock manufacturer dashboard data
        const mockData = {
          manufacturingStats: {
            totalProducts: 156,
            processingBatches: 8,
            completedProducts: 148,
            totalRevenue: 2450000
          },
          availableBatches: [
            { id: 'BATCH-F-2024-012', farmer: 'Rajesh Kumar', herb: 'Ashwagandha', quantity: '500 kg', quality: 'A', price: 250, location: 'Rishikesh' },
            { id: 'BATCH-F-2024-016', farmer: 'Sunita Devi', herb: 'Tulsi', quantity: '300 kg', quality: 'A', price: 180, location: 'Haridwar' },
            { id: 'BATCH-F-2024-017', farmer: 'Mohan Singh', herb: 'Brahmi', quantity: '400 kg', quality: 'B', price: 200, location: 'Dehradun' },
            { id: 'BATCH-F-2024-018', farmer: 'Anita Sharma', herb: 'Neem', quantity: '350 kg', quality: 'A', price: 160, location: 'Rishikesh' }
          ],
          processingQueue: [
            { id: 'PROC-2024-008', product: 'Ashwagandha Extract', stage: 'Drying', progress: 75, estimated: '2 days', quality: 'Good' },
            { id: 'PROC-2024-009', product: 'Tulsi Oil', stage: 'Extraction', progress: 45, estimated: '4 days', quality: 'Good' },
            { id: 'PROC-2024-010', product: 'Brahmi Powder', stage: 'Grinding', progress: 90, estimated: '1 day', quality: 'Excellent' }
          ],
          qualityMetrics: {
            moistureContent: 8.5,
            pesticides: 'Below Limit',
            activeCompounds: 'Optimal',
            heavyMetals: 'Safe'
          },
          productionChart: [
            { month: 'Jan', production: 28 },
            { month: 'Feb', production: 32 },
            { month: 'Mar', production: 35 },
            { month: 'Apr', production: 29 },
            { month: 'May', production: 38 },
            { month: 'Jun', production: 42 }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching manufacturer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading manufacturer dashboard..." />;
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">Manufacturer Dashboard</h1>
              <p className="text-muted mb-0">Welcome back, {user?.name}! Company: {user?.companyName}</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success">
                <i className="fas fa-shopping-cart me-2"></i>
                Purchase Batch
              </button>
              <button className="btn btn-outline-primary">
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manufacturing Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-start border-primary border-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">
                    Total Products
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.manufacturingStats.totalProducts}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-box fa-2x text-success"></i>
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
                    Processing
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.manufacturingStats.processingBatches}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-cogs fa-2x text-success"></i>
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
                    Completed
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.manufacturingStats.completedProducts}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-check-circle fa-2x text-success"></i>
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
                    Total Revenue
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    ₹{dashboardData?.manufacturingStats.totalRevenue.toLocaleString()}
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
        {/* Available Batches for Purchase */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">Available Herb Batches</h6>
              <button className="btn btn-sm btn-outline-primary">View All</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Batch ID</th>
                      <th>Farmer</th>
                      <th>Herb</th>
                      <th>Quantity</th>
                      <th>Quality</th>
                      <th>Price/kg</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.availableBatches.map(batch => (
                      <tr key={batch.id}>
                        <td>
                          <code>{batch.id}</code>
                        </td>
                        <td>{batch.farmer}</td>
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
                        <td>₹{batch.price}</td>
                        <td>
                          <button className="btn btn-sm btn-success">
                            <i className="fas fa-shopping-cart"></i> Buy
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

        {/* Quality Metrics */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Quality Control Metrics</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">Moisture Content</span>
                  <span className="badge bg-success">{dashboardData?.qualityMetrics.moistureContent}%</span>
                </div>
                <div className="progress" style={{height: '8px'}}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{width: `${dashboardData?.qualityMetrics.moistureContent * 10}%`}}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Pesticides</span>
                  <span className="badge bg-success">{dashboardData?.qualityMetrics.pesticides}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Active Compounds</span>
                  <span className="badge bg-success">{dashboardData?.qualityMetrics.activeCompounds}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Heavy Metals</span>
                  <span className="badge bg-success">{dashboardData?.qualityMetrics.heavyMetals}</span>
                </div>
              </div>

              <hr />
              <div className="text-center">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-microscope me-2"></i>
                  View Detailed Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Queue */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Current Processing Queue</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {dashboardData?.processingQueue.map(item => (
                  <div key={item.id} className="col-md-4 mb-3">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{item.product}</h6>
                          <span className="badge bg-primary">{item.stage}</span>
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted">Progress: {item.progress}%</small>
                          <div className="progress mt-1" style={{height: '6px'}}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{width: `${item.progress}%`}}
                            ></div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between small">
                          <span className="text-muted">ETA: {item.estimated}</span>
                          <span className={`badge bg-${
                            item.quality === 'Excellent' ? 'success' :
                            item.quality === 'Good' ? 'primary' : 'warning'
                          }`}>
                            {item.quality}
                          </span>
                        </div>

                        <div className="mt-2">
                          <button className="btn btn-sm btn-outline-primary w-100">
                            <i className="fas fa-eye"></i> View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Chart */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Monthly Production (Products)</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                {dashboardData?.productionChart.map(data => (
                  <div key={data.month} className="col-md-2 mb-3">
                    <div className="card border-0 bg-light">
                      <div className="card-body py-2">
                        <div className="text-muted small">{data.month}</div>
                        <div className="h6 mb-0 text-primary">{data.production}</div>
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
                    <i className="fas fa-leaf fa-2x mb-2"></i><br />
                    Browse Herbs
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-primary w-100 py-3">
                    <i className="fas fa-industry fa-2x mb-2"></i><br />
                    Processing Queue
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning w-100 py-3">
                    <i className="fas fa-microscope fa-2x mb-2"></i><br />
                    Quality Control
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info w-100 py-3">
                    <i className="fas fa-boxes fa-2x mb-2"></i><br />
                    My Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
