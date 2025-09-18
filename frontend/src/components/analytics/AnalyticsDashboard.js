import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = ({ userRole }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        supplyChainMetrics: {
          totalBatches: 1247,
          averageTransitTime: 3.2, // days
          qualityScore: 94.5,
          farmToConsumerTime: 12.8, // days
          traceabilityRate: 98.2,
          sustainabilityScore: 87.3
        },
        productionTrends: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          datasets: [
            {
              label: 'Total Production (kg)',
              data: [12000, 15000, 18000, 16000, 22000, 25000, 28000, 26000, 30000],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4
            },
            {
              label: 'Quality Grade A (%)',
              data: [85, 87, 89, 86, 91, 93, 95, 94, 96],
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.4,
              yAxisID: 'y1',
            }
          ]
        },
        regionalDistribution: {
          labels: ['Uttarakhand', 'Kerala', 'Tamil Nadu', 'Karnataka', 'Madhya Pradesh', 'Gujarat'],
          datasets: [{
            data: [35, 20, 15, 12, 10, 8],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40'
            ],
            borderWidth: 2
          }]
        },
        qualityMetrics: {
          labels: ['Grade A Premium', 'Grade A', 'Grade B+', 'Grade B', 'Grade C'],
          datasets: [{
            label: 'Quality Distribution',
            data: [45, 32, 15, 6, 2],
            backgroundColor: [
              '#28a745',
              '#20c997',
              '#ffc107',
              '#fd7e14',
              '#dc3545'
            ]
          }]
        },
        sustainabilityMetrics: {
          waterUsage: 85.2, // efficiency %
          carbonFootprint: 23.5, // reduced %
          organicCertification: 78.9, // % of batches
          wasteReduction: 42.1, // % improvement
          renewableEnergy: 65.3 // % usage
        },
        realtimeData: {
          activeBatches: 156,
          batchesInTransit: 23,
          qualityTestsPending: 8,
          alertsActive: 3,
          farmersOnline: 89,
          manufacturersActive: 12
        },
        supplyChainFlow: [
          { stage: 'Farm Origin', count: 234, avgTime: 180, efficiency: 94.2 },
          { stage: 'Quality Control', count: 198, avgTime: 2.5, efficiency: 98.5 },
          { stage: 'Processing', count: 187, avgTime: 7.2, efficiency: 92.8 },
          { stage: 'Distribution', count: 156, avgTime: 3.8, efficiency: 89.3 },
          { stage: 'Retail', count: 145, avgTime: 2.1, efficiency: 96.7 }
        ]
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    };

    fetchAnalyticsData();
  }, [timeRange, selectedRegion]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Production Trends & Quality Metrics'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Header Controls */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="h4 mb-0">
            <i className="fas fa-chart-line text-primary me-2"></i>
            Supply Chain Analytics
          </h2>
          <p className="text-muted">Comprehensive insights into your Ayurvedic supply chain performance</p>
        </div>
        <div className="col-md-4">
          <div className="row">
            <div className="col-6">
              <select 
                className="form-select form-select-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="col-6">
              <select 
                className="form-select form-select-sm"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="all">All Regions</option>
                <option value="north">North India</option>
                <option value="south">South India</option>
                <option value="west">West India</option>
                <option value="east">East India</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="row mb-4">
        <div className="col-xl-2 col-md-6 mb-3">
          <div className="card border-start border-primary border-4 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="small text-muted">Total Batches</div>
                  <div className="h5 text-primary mb-0">{analyticsData.supplyChainMetrics.totalBatches.toLocaleString()}</div>
                </div>
                <div className="text-primary">
                  <i className="fas fa-boxes fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-6 mb-3">
          <div className="card border-start border-success border-4 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="small text-muted">Quality Score</div>
                  <div className="h5 text-success mb-0">{analyticsData.supplyChainMetrics.qualityScore}%</div>
                </div>
                <div className="text-success">
                  <i className="fas fa-award fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-6 mb-3">
          <div className="card border-start border-info border-4 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="small text-muted">Avg Transit Time</div>
                  <div className="h5 text-info mb-0">{analyticsData.supplyChainMetrics.averageTransitTime} days</div>
                </div>
                <div className="text-info">
                  <i className="fas fa-shipping-fast fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-6 mb-3">
          <div className="card border-start border-warning border-4 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="small text-muted">Traceability Rate</div>
                  <div className="h5 text-warning mb-0">{analyticsData.supplyChainMetrics.traceabilityRate}%</div>
                </div>
                <div className="text-warning">
                  <i className="fas fa-route fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-6 mb-3">
          <div className="card border-start border-danger border-4 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="small text-muted">Farm-to-Consumer</div>
                  <div className="h5 text-danger mb-0">{analyticsData.supplyChainMetrics.farmToConsumerTime} days</div>
                </div>
                <div className="text-danger">
                  <i className="fas fa-clock fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-6 mb-3">
          <div className="card border-start border-secondary border-4 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="small text-muted">Sustainability</div>
                  <div className="h5 text-secondary mb-0">{analyticsData.supplyChainMetrics.sustainabilityScore}%</div>
                </div>
                <div className="text-secondary">
                  <i className="fas fa-leaf fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        {/* Production Trends Chart */}
        <div className="col-xl-8 col-lg-7 mb-4">
          <div className="card shadow h-100">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold text-primary">Production Trends & Quality Analysis</h6>
            </div>
            <div className="card-body">
              <Line data={analyticsData.productionTrends} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="col-xl-4 col-lg-5 mb-4">
          <div className="card shadow h-100">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold text-primary">Regional Distribution</h6>
            </div>
            <div className="card-body">
              <Pie 
                data={analyticsData.regionalDistribution} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        {/* Quality Metrics */}
        <div className="col-xl-6 col-lg-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold text-primary">Quality Grade Distribution</h6>
            </div>
            <div className="card-body">
              <Bar 
                data={analyticsData.qualityMetrics}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Percentage (%)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div className="col-xl-6 col-lg-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold text-primary">Sustainability Metrics</h6>
            </div>
            <div className="card-body">
              {Object.entries(analyticsData.sustainabilityMetrics).map(([key, value]) => (
                <div key={key} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small text-capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="small font-weight-bold">{value}%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className={`progress-bar ${
                        value > 80 ? 'bg-success' : 
                        value > 60 ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supply Chain Flow */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold text-primary">Supply Chain Flow Analysis</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {analyticsData.supplyChainFlow.map((stage, index) => (
                  <div key={stage.stage} className="col-md mb-3">
                    <div className="text-center">
                      <div className="position-relative">
                        <div 
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2"
                          style={{ width: '60px', height: '60px' }}
                        >
                          <strong>{stage.count}</strong>
                        </div>
                        {index < analyticsData.supplyChainFlow.length - 1 && (
                          <div 
                            className="position-absolute"
                            style={{ 
                              top: '50%', 
                              left: '100%', 
                              transform: 'translateY(-50%)',
                              width: '100%',
                              height: '2px',
                              backgroundColor: '#dee2e6'
                            }}
                          />
                        )}
                      </div>
                      <h6 className="small font-weight-bold">{stage.stage}</h6>
                      <div className="small text-muted">
                        <div>Avg Time: {stage.avgTime} {stage.stage === 'Farm Origin' ? 'days' : 'days'}</div>
                        <div className="text-success">Efficiency: {stage.efficiency}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Monitoring */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Real-time Monitoring</h6>
              <div className="d-flex align-items-center">
                <div className="spinner-grow spinner-grow-sm text-success me-2" role="status"></div>
                <small className="text-success">Live</small>
              </div>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-2 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-primary mb-1">{analyticsData.realtimeData.activeBatches}</div>
                    <div className="small text-muted">Active Batches</div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-warning mb-1">{analyticsData.realtimeData.batchesInTransit}</div>
                    <div className="small text-muted">In Transit</div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-info mb-1">{analyticsData.realtimeData.qualityTestsPending}</div>
                    <div className="small text-muted">QC Pending</div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-danger mb-1">{analyticsData.realtimeData.alertsActive}</div>
                    <div className="small text-muted">Active Alerts</div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-success mb-1">{analyticsData.realtimeData.farmersOnline}</div>
                    <div className="small text-muted">Farmers Online</div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="border rounded p-3">
                    <div className="h4 text-secondary mb-1">{analyticsData.realtimeData.manufacturersActive}</div>
                    <div className="small text-muted">Manufacturers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
