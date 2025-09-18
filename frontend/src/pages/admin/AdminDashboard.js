import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard';
import SupplyChainMap from '../../components/mapping/SupplyChainMap';
import BlockchainLedger from '../../components/admin/BlockchainLedger';
import localStorageManager from '../../utils/localStorage';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'analytics', 'map', 'blockchain'
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showBlockchainLedger, setShowBlockchainLedger] = useState(false);
  const [blockchainStats, setBlockchainStats] = useState({});

  // Simulate API call to fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get real blockchain statistics
        const bcStats = localStorageManager.getBlockchainStatistics();
        setBlockchainStats(bcStats);
        
        // Mock dashboard data with real blockchain stats
        const mockData = {
          systemStats: {
            totalUsers: 1547,
            activeBatches: 892,
            totalTransactions: bcStats.totalTransactions || 15420,
            systemUptime: '99.9%'
          },
          userStats: {
            farmers: 645,
            manufacturers: 178,
            consumers: 724,
            admins: 15
          },
          recentActivity: [
            { id: 1, type: 'user_registration', user: 'Rajesh Kumar', role: 'farmer', time: '2 minutes ago' },
            { id: 2, type: 'batch_created', user: 'Green Valley Farm', batch: 'BATCH-2024-001', time: '5 minutes ago' },
            { id: 3, type: 'product_verified', user: 'Consumer', batch: 'BATCH-2024-001', time: '8 minutes ago' },
            { id: 4, type: 'quality_test', user: 'Ayur Labs', batch: 'BATCH-2024-002', time: '15 minutes ago' }
          ],
          systemHealth: {
            api: { status: 'healthy', responseTime: '45ms' },
            database: { status: 'mock', connectionPool: 'N/A' },
            blockchain: { status: 'healthy', blockHeight: `Block #${bcStats.latestBlock || 'Demo'}` },
            storage: { status: 'healthy', usage: '67%' }
          }
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen={true} text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center">
                  <div className="mb-3 mb-lg-0">
                    <h1 className="h3 mb-2 fw-bold text-dark">🛡️ Admin Dashboard</h1>
                    <p className="text-muted mb-0">Welcome back, <span className="fw-semibold">{user?.name}</span>! System oversight and management</p>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <div className="btn-group" role="group">
                      <button 
                        className={`btn btn-sm ${activeView === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveView('dashboard')}
                      >
                        <i className="fas fa-tachometer-alt me-1"></i>
                        <span className="d-none d-md-inline">Overview</span>
                      </button>
                      <button 
                        className={`btn btn-sm ${activeView === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveView('analytics')}
                      >
                        <i className="fas fa-chart-line me-1"></i>
                        <span className="d-none d-md-inline">Analytics</span>
                      </button>
                      <button 
                        className={`btn btn-sm ${activeView === 'blockchain' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveView('blockchain')}
                      >
                        <i className="fas fa-link me-1"></i>
                        <span className="d-none d-md-inline">Blockchain</span>
                      </button>
                      <button 
                        className={`btn btn-sm ${activeView === 'map' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveView('map')}
                      >
                        <i className="fas fa-map me-1"></i>
                        <span className="d-none d-lg-inline">Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* System Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card shadow h-100 py-2 border-start border-primary border-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.systemStats.totalUsers.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-success"></i>
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
                    {dashboardData?.systemStats.activeBatches.toLocaleString()}
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
          <div className="card shadow h-100 py-2 border-start border-info border-4">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-info text-uppercase mb-1">
                    Blockchain Transactions
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {blockchainStats.totalTransactions || dashboardData?.systemStats.totalTransactions.toLocaleString()}
                  </div>
                  <small className="text-muted">
                    {blockchainStats.recentTransactions || 0} in last 24h
                  </small>
                </div>
                <div className="col-auto">
                  <i className="fas fa-link fa-2x text-info"></i>
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
                    System Uptime
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {dashboardData?.systemStats.systemUptime}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-server fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="row">
        {/* User Distribution */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">User Distribution</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="text-success">
                    <i className="fas fa-tractor fa-2x mb-2"></i>
                  </div>
                  <div className="h5 mb-0">{dashboardData?.userStats.farmers}</div>
                  <small className="text-muted">Farmers</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-primary">
                    <i className="fas fa-industry fa-2x mb-2"></i>
                  </div>
                  <div className="h5 mb-0">{dashboardData?.userStats.manufacturers}</div>
                  <small className="text-muted">Manufacturers</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-info">
                    <i className="fas fa-users fa-2x mb-2"></i>
                  </div>
                  <div className="h5 mb-0">{dashboardData?.userStats.consumers}</div>
                  <small className="text-muted">Consumers</small>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-warning">
                    <i className="fas fa-user-shield fa-2x mb-2"></i>
                  </div>
                  <div className="h5 mb-0">{dashboardData?.userStats.admins}</div>
                  <small className="text-muted">Admins</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">Recent Activity</h6>
              <button className="btn btn-sm btn-outline-primary">View All</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>User</th>
                      <th>Details</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentActivity.map(activity => (
                      <tr key={activity.id}>
                        <td>
                          <span className={`badge ${
                            activity.type === 'user_registration' ? 'bg-success' :
                            activity.type === 'batch_created' ? 'bg-primary' :
                            activity.type === 'product_verified' ? 'bg-info' :
                            'bg-warning'
                          }`}>
                            {activity.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{activity.user}</td>
                        <td>
                          {activity.role && <span className="text-muted">({activity.role})</span>}
                          {activity.batch && <code>{activity.batch}</code>}
                        </td>
                        <td className="text-muted">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">System Health</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {Object.entries(dashboardData?.systemHealth || {}).map(([service, health]) => (
                  <div key={service} className="col-xl-3 col-md-6 mb-3">
                    <div className={`card border-start border-4 h-100 border-${
                      health.status === 'healthy' ? 'success' :
                      health.status === 'demo' || health.status === 'mock' ? 'warning' :
                      'danger'
                    }`}>
                      <div className="card-body py-3">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1">
                            <div className="text-xs fw-bold text-uppercase mb-1">
                              {service.toUpperCase()}
                            </div>
                            <div className="h6 mb-0 fw-bold">
                              <span className={`badge bg-${
                                health.status === 'healthy' ? 'success' :
                                health.status === 'demo' || health.status === 'mock' ? 'warning' :
                                'danger'
                              }`}>
                                {health.status.toUpperCase()}
                              </span>
                            </div>
                            <small className="text-muted">
                              {health.responseTime || health.connectionPool || health.blockHeight || health.usage || 'Status OK'}
                            </small>
                          </div>
                          <div>
                            <i className={`fas ${
                              service === 'api' ? 'fa-server' :
                              service === 'database' ? 'fa-database' :
                              service === 'blockchain' ? 'fa-link' :
                              'fa-hdd'
                            } fa-2x ${
                              health.status === 'healthy' ? 'text-success' :
                              health.status === 'demo' || health.status === 'mock' ? 'text-warning' :
                              'text-danger'
                            }`}></i>
                          </div>
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
                  <button className="btn btn-outline-primary w-100 py-3">
                    <i className="fas fa-users fa-2x mb-2"></i><br />
                    Manage Users
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-success w-100 py-3">
                    <i className="fas fa-chart-bar fa-2x mb-2"></i><br />
                    View Analytics
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-info w-100 py-3">
                    <i className="fas fa-boxes fa-2x mb-2"></i><br />
                    All Batches
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-outline-warning w-100 py-3"
                    onClick={() => setShowBlockchainLedger(true)}
                  >
                    <i className="fas fa-link fa-2x mb-2"></i><br />
                    Blockchain Ledger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {activeView === 'dashboard' && (
        <div>Dashboard content here...</div>
      )}

      {activeView === 'analytics' && (
        <div className="mt-4">
          <AnalyticsDashboard userRole="admin" />
        </div>
      )}

      {activeView === 'blockchain' && (
        <div className="mt-4">
          <div className="row">
            <div className="col-12">
              <div className="card shadow">
                <div className="card-header py-3">
                  <h6 className="m-0 fw-bold text-primary">
                    <i className="fas fa-link me-2"></i>
                    Blockchain Network Overview
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <div className="text-center">
                        <div className="h4 text-primary mb-1">{blockchainStats.totalTransactions || 0}</div>
                        <small className="text-muted">Total Transactions</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="text-center">
                        <div className="h4 text-success mb-1">{blockchainStats.uniqueParticipants || 0}</div>
                        <small className="text-muted">Unique Participants</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="text-center">
                        <div className="h4 text-warning mb-1">#{blockchainStats.latestBlock || 0}</div>
                        <small className="text-muted">Latest Block</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="text-center">
                        <div className="h4 text-info mb-1">{blockchainStats.totalValue?.toFixed(1) || '0.0'} AYUR</div>
                        <small className="text-muted">Total Value</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowBlockchainLedger(true)}
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      Open Full Blockchain Ledger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'map' && (
        <div className="mt-4">
          <SupplyChainMap viewMode="admin" />
        </div>
      )}

      {/* User Management Modal */}
      {showUserManagement && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Management - Coming Soon</h5>
                <button type="button" className="btn-close" onClick={() => setShowUserManagement(false)}></button>
              </div>
              <div className="modal-body">
                <p>Advanced user management functionality will be implemented in the next phase.</p>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Blockchain Ledger Modal */}
        {showBlockchainLedger && (
          <BlockchainLedger onClose={() => setShowBlockchainLedger(false)} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
