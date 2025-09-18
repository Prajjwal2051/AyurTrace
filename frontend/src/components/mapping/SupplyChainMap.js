import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different stages
const farmIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2990/2990507.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const manufacturerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const distributorIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/411/411763.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const retailIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/869/869636.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const SupplyChainMap = ({ selectedBatch, viewMode = 'overview' }) => {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [realTimeTracking, setRealTimeTracking] = useState(false);

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockMapData = {
        supplyChainLocations: [
          {
            id: 'farm-001',
            type: 'farm',
            name: 'Green Valley Organic Farm',
            farmer: 'Rajesh Kumar',
            coordinates: [30.0869, 78.2676], // Rishikesh, Uttarakhand
            address: 'Village Tapovan, Rishikesh, Uttarakhand 249192',
            details: {
              area: '25 acres',
              crops: ['Ashwagandha', 'Tulsi', 'Brahmi'],
              organicCertified: true,
              establishedYear: 2018,
              currentBatches: 12,
              quality: 'Grade A Premium'
            },
            batches: [
              { id: 'BATCH-F-2024-012', crop: 'Ashwagandha', quantity: '500 kg', status: 'Harvested' },
              { id: 'BATCH-F-2024-013', crop: 'Tulsi', quantity: '300 kg', status: 'Growing' }
            ]
          },
          {
            id: 'farm-002',
            type: 'farm',
            name: 'Himalayan Herbs Farm',
            farmer: 'Sunita Devi',
            coordinates: [29.9457, 78.1642], // Haridwar, Uttarakhand
            address: 'Kankhal, Haridwar, Uttarakhand 249408',
            details: {
              area: '18 acres',
              crops: ['Turmeric', 'Ginger', 'Neem'],
              organicCertified: true,
              establishedYear: 2015,
              currentBatches: 8,
              quality: 'Grade A'
            },
            batches: [
              { id: 'BATCH-F-2024-016', crop: 'Turmeric', quantity: '800 kg', status: 'Processing' }
            ]
          },
          {
            id: 'manufacturer-001',
            type: 'manufacturer',
            name: 'Ayur Processing Industries',
            company: 'Pure Ayurveda Ltd.',
            coordinates: [28.6139, 77.2090], // New Delhi
            address: 'Sector 18, Gurgaon, Haryana 122015',
            details: {
              capacity: '5000 kg/month',
              certifications: ['GMP', 'ISO', 'FSSAI'],
              establishedYear: 2012,
              employeeCount: 45,
              processingTypes: ['Extraction', 'Powder Processing', 'Encapsulation']
            },
            currentProduction: [
              { product: 'Ashwagandha Capsules', quantity: '10000 units', stage: 'Quality Control' },
              { product: 'Tulsi Extract', quantity: '2000 bottles', stage: 'Processing' }
            ]
          },
          {
            id: 'distributor-001',
            type: 'distributor',
            name: 'Central Distribution Hub',
            company: 'AyurLogistics Pvt Ltd',
            coordinates: [19.0760, 72.8777], // Mumbai
            address: 'Andheri East, Mumbai, Maharashtra 400069',
            details: {
              warehouseArea: '50000 sq ft',
              storageCapacity: '100 tons',
              temperatureControlled: true,
              deliveryNetwork: '500+ stores',
              avgDeliveryTime: '2-3 days'
            },
            inventory: [
              { product: 'Ashwagandha Capsules', stock: '25000 units', demand: 'High' },
              { product: 'Tulsi Products', stock: '15000 units', demand: 'Medium' }
            ]
          },
          {
            id: 'retail-001',
            type: 'retail',
            name: 'Ayur Wellness Store',
            coordinates: [12.9716, 77.5946], // Bangalore
            address: 'MG Road, Bangalore, Karnataka 560001',
            details: {
              storeSize: '2000 sq ft',
              productRange: '200+ items',
              certifications: ['Ayush License'],
              customerFootfall: '500/day',
              rating: 4.7
            },
            sales: [
              { product: 'Ashwagandha Capsules', monthlySales: '2000 units', trend: 'up' },
              { product: 'Tulsi Tea', monthlySales: '1500 packets', trend: 'stable' }
            ]
          },
          {
            id: 'retail-002',
            type: 'retail',
            name: 'Natural Health Pharmacy',
            coordinates: [22.5726, 88.3639], // Kolkata
            address: 'Park Street, Kolkata, West Bengal 700016',
            details: {
              storeSize: '1500 sq ft',
              productRange: '150+ items',
              certifications: ['Pharmacy License', 'Ayush Approved'],
              customerFootfall: '300/day',
              rating: 4.5
            },
            sales: [
              { product: 'Brahmi Oil', monthlySales: '800 bottles', trend: 'up' }
            ]
          }
        ],
        supplyRoutes: [
          {
            id: 'route-001',
            from: 'farm-001',
            to: 'manufacturer-001',
            coordinates: [
              [30.0869, 78.2676],
              [28.6139, 77.2090]
            ],
            distance: '245 km',
            avgTransitTime: '6 hours',
            transportMode: 'Refrigerated Truck',
            status: 'Active',
            batches: ['BATCH-F-2024-012']
          },
          {
            id: 'route-002',
            from: 'manufacturer-001',
            to: 'distributor-001',
            coordinates: [
              [28.6139, 77.2090],
              [19.0760, 72.8777]
            ],
            distance: '1150 km',
            avgTransitTime: '18 hours',
            transportMode: 'Express Logistics',
            status: 'In Transit',
            batches: ['PROD-2024-045', 'PROD-2024-046']
          },
          {
            id: 'route-003',
            from: 'distributor-001',
            to: 'retail-001',
            coordinates: [
              [19.0760, 72.8777],
              [12.9716, 77.5946]
            ],
            distance: '980 km',
            avgTransitTime: '24 hours',
            transportMode: 'Standard Delivery',
            status: 'Active',
            batches: ['FINAL-2024-089']
          }
        ],
        regionalStats: {
          'North India': { farms: 45, manufacturers: 8, distributors: 3, retailers: 120 },
          'South India': { farms: 38, manufacturers: 12, distributors: 4, retailers: 95 },
          'West India': { farms: 32, manufacturers: 15, distributors: 6, retailers: 150 },
          'East India': { farms: 28, manufacturers: 5, distributors: 2, retailers: 80 }
        }
      };

      setMapData(mockMapData);
      setLoading(false);
    };

    fetchMapData();
  }, [selectedBatch]);

  // Function to get icon based on location type
  const getLocationIcon = (type) => {
    switch (type) {
      case 'farm': return farmIcon;
      case 'manufacturer': return manufacturerIcon;
      case 'distributor': return distributorIcon;
      case 'retail': return retailIcon;
      default: return new L.Icon.Default();
    }
  };

  // Function to get color based on route status
  const getRouteColor = (status) => {
    switch (status) {
      case 'Active': return '#28a745';
      case 'In Transit': return '#ffc107';
      case 'Delayed': return '#dc3545';
      case 'Completed': return '#6c757d';
      default: return '#007bff';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="supply-chain-map">
      {/* Map Controls */}
      <div className="row mb-3">
        <div className="col-md-8">
          <h5 className="mb-0">
            <i className="fas fa-map-marked-alt text-primary me-2"></i>
            Supply Chain Geographic View
          </h5>
          <p className="text-muted small mb-0">
            Real-time tracking of batches across the Ayurvedic supply chain network
          </p>
        </div>
        <div className="col-md-4">
          <div className="d-flex gap-2">
            <button 
              className={`btn btn-sm ${realTimeTracking ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setRealTimeTracking(!realTimeTracking)}
            >
              <i className="fas fa-broadcast-tower me-1"></i>
              {realTimeTracking ? 'Live Tracking' : 'Enable Live'}
            </button>
            <div className="btn-group" role="group">
              <button className="btn btn-outline-primary btn-sm active">
                <i className="fas fa-globe"></i>
              </button>
              <button className="btn btn-outline-primary btn-sm">
                <i className="fas fa-satellite"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body py-2">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded me-2" 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: '#28a745',
                      display: 'inline-block'
                    }}
                  ></div>
                  <small>Farms</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded me-2" 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: '#007bff',
                      display: 'inline-block'
                    }}
                  ></div>
                  <small>Manufacturers</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded me-2" 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: '#ffc107',
                      display: 'inline-block'
                    }}
                  ></div>
                  <small>Distributors</small>
                </div>
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded me-2" 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: '#dc3545',
                      display: 'inline-block'
                    }}
                  ></div>
                  <small>Retailers</small>
                </div>
                <div className="vr"></div>
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Click on markers for detailed information
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Map Container */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow">
            <div className="card-body p-0">
              <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5}
                style={{ height: '600px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Location Markers */}
                {mapData?.supplyChainLocations.map(location => (
                  <Marker
                    key={location.id}
                    position={location.coordinates}
                    icon={getLocationIcon(location.type)}
                    eventHandlers={{
                      click: () => setSelectedLocation(location)
                    }}
                  >
                    <Popup>
                      <div style={{ minWidth: '200px' }}>
                        <h6 className="mb-2">
                          <i className={`fas ${
                            location.type === 'farm' ? 'fa-leaf' :
                            location.type === 'manufacturer' ? 'fa-industry' :
                            location.type === 'distributor' ? 'fa-truck' : 'fa-store'
                          } me-1`}></i>
                          {location.name}
                        </h6>
                        <p className="small text-muted mb-2">{location.address}</p>
                        
                        {location.type === 'farm' && (
                          <div>
                            <div className="small mb-1">
                              <strong>Farmer:</strong> {location.farmer}
                            </div>
                            <div className="small mb-1">
                              <strong>Area:</strong> {location.details.area}
                            </div>
                            <div className="small mb-2">
                              <strong>Crops:</strong> {location.details.crops.join(', ')}
                            </div>
                            {location.details.organicCertified && (
                              <span className="badge bg-success small">Organic Certified</span>
                            )}
                          </div>
                        )}
                        
                        {location.type === 'manufacturer' && (
                          <div>
                            <div className="small mb-1">
                              <strong>Company:</strong> {location.company}
                            </div>
                            <div className="small mb-1">
                              <strong>Capacity:</strong> {location.details.capacity}
                            </div>
                            <div className="small mb-2">
                              <strong>Certifications:</strong> {location.details.certifications.join(', ')}
                            </div>
                          </div>
                        )}
                        
                        <button 
                          className="btn btn-primary btn-sm w-100 mt-2"
                          onClick={() => setSelectedLocation(location)}
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Supply Routes */}
                {mapData?.supplyRoutes.map(route => (
                  <Polyline
                    key={route.id}
                    positions={route.coordinates}
                    pathOptions={{
                      color: getRouteColor(route.status),
                      weight: 3,
                      opacity: 0.7,
                      dashArray: route.status === 'In Transit' ? '5, 10' : null
                    }}
                  >
                    <Popup>
                      <div>
                        <h6>Supply Route</h6>
                        <div className="small">
                          <div><strong>Distance:</strong> {route.distance}</div>
                          <div><strong>Transit Time:</strong> {route.avgTransitTime}</div>
                          <div><strong>Transport:</strong> {route.transportMode}</div>
                          <div><strong>Status:</strong> 
                            <span className={`badge bg-${
                              route.status === 'Active' ? 'success' :
                              route.status === 'In Transit' ? 'warning' : 'secondary'
                            } ms-1`}>
                              {route.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Polyline>
                ))}

                {/* Real-time tracking indicators */}
                {realTimeTracking && (
                  <>
                    <CircleMarker
                      center={[28.0, 77.5]}
                      radius={8}
                      pathOptions={{ color: '#28a745', fillColor: '#28a745', fillOpacity: 0.7 }}
                    >
                      <Popup>
                        <div>
                          <strong>Live Shipment</strong><br/>
                          Batch: BATCH-F-2024-012<br/>
                          ETA: 2 hours
                        </div>
                      </Popup>
                    </CircleMarker>
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Location Details Panel */}
        <div className="col-xl-4 col-lg-5">
          {selectedLocation ? (
            <div className="card shadow">
              <div className="card-header">
                <h6 className="m-0">
                  <i className={`fas ${
                    selectedLocation.type === 'farm' ? 'fa-leaf text-success' :
                    selectedLocation.type === 'manufacturer' ? 'fa-industry text-primary' :
                    selectedLocation.type === 'distributor' ? 'fa-truck text-warning' : 
                    'fa-store text-danger'
                  } me-2`}></i>
                  {selectedLocation.name}
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="small text-muted">Address</div>
                  <div>{selectedLocation.address}</div>
                </div>
                
                <div className="mb-3">
                  <div className="small text-muted">Coordinates</div>
                  <code className="small">
                    {selectedLocation.coordinates[0].toFixed(4)}, {selectedLocation.coordinates[1].toFixed(4)}
                  </code>
                </div>

                {/* Type-specific details */}
                {selectedLocation.type === 'farm' && (
                  <div>
                    <div className="mb-3">
                      <div className="small text-muted">Farm Details</div>
                      <div className="row">
                        <div className="col-6">
                          <div className="small"><strong>Area:</strong> {selectedLocation.details.area}</div>
                        </div>
                        <div className="col-6">
                          <div className="small"><strong>Quality:</strong> {selectedLocation.details.quality}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="small text-muted mb-1">Current Crops</div>
                      <div className="d-flex flex-wrap gap-1">
                        {selectedLocation.details.crops.map(crop => (
                          <span key={crop} className="badge bg-success small">{crop}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="small text-muted mb-2">Active Batches</div>
                      {selectedLocation.batches.map(batch => (
                        <div key={batch.id} className="border rounded p-2 mb-2">
                          <div className="d-flex justify-content-between">
                            <div>
                              <code className="small">{batch.id}</code>
                              <div className="small">{batch.crop} - {batch.quantity}</div>
                            </div>
                            <span className={`badge bg-${
                              batch.status === 'Harvested' ? 'success' : 
                              batch.status === 'Growing' ? 'primary' : 'warning'
                            } small`}>
                              {batch.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLocation.type === 'manufacturer' && (
                  <div>
                    <div className="mb-3">
                      <div className="small text-muted">Manufacturing Details</div>
                      <div className="small"><strong>Capacity:</strong> {selectedLocation.details.capacity}</div>
                      <div className="small"><strong>Employees:</strong> {selectedLocation.details.employeeCount}</div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="small text-muted mb-1">Certifications</div>
                      <div className="d-flex flex-wrap gap-1">
                        {selectedLocation.details.certifications.map(cert => (
                          <span key={cert} className="badge bg-primary small">{cert}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="small text-muted mb-2">Current Production</div>
                      {selectedLocation.currentProduction.map((prod, index) => (
                        <div key={index} className="border rounded p-2 mb-2">
                          <div className="small"><strong>{prod.product}</strong></div>
                          <div className="d-flex justify-content-between">
                            <span className="small text-muted">{prod.quantity}</span>
                            <span className="badge bg-info small">{prod.stage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-route me-1"></i>
                    View Supply Chain
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-chart-bar me-1"></i>
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow">
              <div className="card-header">
                <h6 className="m-0">Regional Statistics</h6>
              </div>
              <div className="card-body">
                {Object.entries(mapData?.regionalStats || {}).map(([region, stats]) => (
                  <div key={region} className="mb-3 p-3 border rounded">
                    <h6 className="mb-2">{region}</h6>
                    <div className="row text-center">
                      <div className="col-3">
                        <div className="small text-muted">Farms</div>
                        <div className="fw-bold text-success">{stats.farms}</div>
                      </div>
                      <div className="col-3">
                        <div className="small text-muted">Mfg</div>
                        <div className="fw-bold text-primary">{stats.manufacturers}</div>
                      </div>
                      <div className="col-3">
                        <div className="small text-muted">Dist</div>
                        <div className="fw-bold text-warning">{stats.distributors}</div>
                      </div>
                      <div className="col-3">
                        <div className="small text-muted">Retail</div>
                        <div className="fw-bold text-danger">{stats.retailers}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Click on map markers for detailed information
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplyChainMap;
