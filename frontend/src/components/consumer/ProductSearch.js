import React, { useState, useEffect } from 'react';

const ProductSearch = ({ onClose, onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    grade: '',
    farm: '',
    certification: '',
    priceRange: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: 'Ashwagandha Root Powder',
      brand: 'Pure Ayur Herbs',
      batchId: 'BATCH-F-2024-012',
      category: 'Adaptogens',
      grade: 'Grade A Premium',
      farm: 'Green Valley Organic Farm',
      location: 'Rishikesh, Uttarakhand',
      price: '₹899',
      rating: 4.8,
      reviews: 245,
      certification: ['Organic', 'FSSAI', 'GMP'],
      inStock: true,
      imageUrl: '/api/placeholder/150/150',
      description: 'Premium quality Ashwagandha root powder with high withanolide content',
      benefits: ['Stress relief', 'Energy boost', 'Immunity'],
      verificationStatus: 'Verified',
      lastTested: '2024-09-15'
    },
    {
      id: 2,
      name: 'Turmeric Powder',
      brand: 'Herbal Essence',
      batchId: 'BATCH-F-2024-013',
      category: 'Spices & Herbs',
      grade: 'Grade A',
      farm: 'Golden Turmeric Farm',
      location: 'Kerala, India',
      price: '₹299',
      rating: 4.6,
      reviews: 180,
      certification: ['Organic', 'FSSAI'],
      inStock: true,
      imageUrl: '/api/placeholder/150/150',
      description: 'Pure turmeric powder with high curcumin content',
      benefits: ['Anti-inflammatory', 'Antioxidant', 'Digestive health'],
      verificationStatus: 'Verified',
      lastTested: '2024-09-14'
    },
    {
      id: 3,
      name: 'Brahmi Oil',
      brand: 'Ayur Care',
      batchId: 'BATCH-M-2024-001',
      category: 'Herbal Oils',
      grade: 'Grade B+',
      farm: 'Brahmi Herbs Garden',
      location: 'Tamil Nadu, India',
      price: '₹599',
      rating: 4.4,
      reviews: 95,
      certification: ['FSSAI', 'GMP'],
      inStock: false,
      imageUrl: '/api/placeholder/150/150',
      description: 'Traditional Brahmi oil for hair and scalp health',
      benefits: ['Hair growth', 'Stress relief', 'Mental clarity'],
      verificationStatus: 'Warning',
      lastTested: '2024-09-10'
    },
    {
      id: 4,
      name: 'Triphala Tablets',
      brand: 'Natural Wellness',
      batchId: 'BATCH-F-2024-014',
      category: 'Digestive Health',
      grade: 'Grade A Premium',
      farm: 'Triphala Organic Farm',
      location: 'Madhya Pradesh, India',
      price: '₹449',
      rating: 4.7,
      reviews: 320,
      certification: ['Organic', 'FSSAI', 'GMP', 'ISO'],
      inStock: true,
      imageUrl: '/api/placeholder/150/150',
      description: 'Premium Triphala tablets for digestive wellness',
      benefits: ['Digestive health', 'Detoxification', 'Immunity'],
      verificationStatus: 'Verified',
      lastTested: '2024-09-12'
    },
    {
      id: 5,
      name: 'Tulsi Leaves Extract',
      brand: 'Sacred Herbs',
      batchId: 'BATCH-F-2024-015',
      category: 'Immunity Boosters',
      grade: 'Grade A',
      farm: 'Holy Basil Plantation',
      location: 'Uttar Pradesh, India',
      price: '₹349',
      rating: 4.5,
      reviews: 156,
      certification: ['Organic', 'FSSAI'],
      inStock: true,
      imageUrl: '/api/placeholder/150/150',
      description: 'Pure Tulsi leaves extract for immunity and wellness',
      benefits: ['Immunity boost', 'Respiratory health', 'Stress relief'],
      verificationStatus: 'Verified',
      lastTested: '2024-09-13'
    }
  ];

  const categories = ['All Categories', 'Adaptogens', 'Spices & Herbs', 'Herbal Oils', 'Digestive Health', 'Immunity Boosters'];
  const grades = ['All Grades', 'Grade A Premium', 'Grade A', 'Grade B+', 'Grade B'];
  const certifications = ['All Certifications', 'Organic', 'FSSAI', 'GMP', 'ISO'];

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const performSearch = React.useCallback(async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredResults = mockProducts.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !filters.category || filters.category === 'All Categories' || product.category === filters.category;
      const matchesGrade = !filters.grade || filters.grade === 'All Grades' || product.grade === filters.grade;
      const matchesCertification = !filters.certification || filters.certification === 'All Certifications' || 
        product.certification.includes(filters.certification);
      
      return matchesSearch && matchesCategory && matchesGrade && matchesCertification;
    });

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filteredResults.sort((a, b) => parseInt(a.price.replace('₹', '')) - parseInt(b.price.replace('₹', '')));
        break;
      case 'price-high':
        filteredResults.sort((a, b) => parseInt(b.price.replace('₹', '')) - parseInt(a.price.replace('₹', '')));
        break;
      case 'name':
        filteredResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep relevance order
        break;
    }

    setResults(filteredResults);
    setLoading(false);
  }, [searchTerm, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      grade: '',
      farm: '',
      certification: '',
      priceRange: ''
    });
    setSearchTerm('');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Verified': return 'bg-success';
      case 'Warning': return 'bg-warning';
      case 'Failed': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-search me-2"></i>
              Product Search & Discovery
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Search Bar */}
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="input-group input-group-lg">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for Ayurvedic products, brands, benefits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select form-select-lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Filters */}
            <div className="row mb-4 g-3">
              <div className="col-6 col-md-3 col-lg-2">
                <label className="form-label small text-muted">Category</label>
                <select 
                  className="form-select form-select-sm"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All Categories' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <label className="form-label small text-muted">Grade</label>
                <select 
                  className="form-select form-select-sm"
                  value={filters.grade}
                  onChange={(e) => handleFilterChange('grade', e.target.value)}
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade === 'All Grades' ? '' : grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <label className="form-label small text-muted">Certification</label>
                <select 
                  className="form-select form-select-sm"
                  value={filters.certification}
                  onChange={(e) => handleFilterChange('certification', e.target.value)}
                >
                  {certifications.map(cert => (
                    <option key={cert} value={cert === 'All Certifications' ? '' : cert}>
                      {cert}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <label className="form-label small text-muted">Quick Scan</label>
                <button className="btn btn-success btn-sm w-100">
                  <i className="fas fa-qrcode me-1"></i>
                  <span className="d-none d-sm-inline">QR Scan</span>
                  <span className="d-sm-none">Scan</span>
                </button>
              </div>
              <div className="col-12 col-lg-4">
                <label className="form-label small text-muted d-none d-lg-block">&nbsp;</label>
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                    <i className="fas fa-times me-1"></i>
                    Clear Filters
                  </button>
                  <span className="text-muted small">
                    {results.length} products found
                  </span>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
                <p className="text-muted mt-2">Searching products...</p>
              </div>
            )}

            {/* Results */}
            {!loading && (
              <div className="row">
                {results.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <i className="fas fa-search-minus fa-4x text-muted mb-3"></i>
                    <h5>No products found</h5>
                    <p className="text-muted">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  </div>
                ) : (
                  results.map(product => (
                    <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="flex-grow-1">
                              <h6 className="card-title mb-1">{product.name}</h6>
                              <div className="text-muted small mb-1">{product.brand}</div>
                            </div>
                            <span className={`badge ${getStatusBadgeClass(product.verificationStatus)}`}>
                              {product.verificationStatus}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <div className="d-flex align-items-center mb-1">
                              <div className="me-2">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'} small`}
                                  ></i>
                                ))}
                              </div>
                              <small className="text-muted">
                                {product.rating} ({product.reviews} reviews)
                              </small>
                            </div>
                            <div className="small text-muted mb-2">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {product.location}
                            </div>
                          </div>

                          <div className="mb-2">
                            <div className="d-flex flex-wrap gap-1">
                              {product.certification.slice(0, 3).map(cert => (
                                <span key={cert} className="badge bg-light text-dark small">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mb-2">
                            <small className="text-muted">{product.description}</small>
                          </div>

                          <div className="mb-3">
                            <small className="text-success">
                              <strong>Benefits:</strong> {product.benefits.join(', ')}
                            </small>
                          </div>

                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="text-primary mb-0">{product.price}</h6>
                              <small className="text-muted">{product.grade}</small>
                            </div>
                            <div>
                              {product.inStock ? (
                                <span className="badge bg-success small">In Stock</span>
                              ) : (
                                <span className="badge bg-danger small">Out of Stock</span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="btn-group w-100" role="group">
                              <button 
                                className="btn btn-sm btn-outline-info"
                                onClick={() => onSelectProduct && onSelectProduct(product)}
                              >
                                <i className="fas fa-route"></i> Journey
                              </button>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-heart"></i> Save
                              </button>
                              <button className="btn btn-sm btn-outline-success">
                                <i className="fas fa-share"></i> Share
                              </button>
                            </div>
                          </div>

                          <div className="mt-2 text-center">
                            <small className="text-muted">
                              Batch: <code>{product.batchId}</code> • 
                              Last tested: {product.lastTested}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <div className="me-auto">
              <small className="text-muted">
                <i className="fas fa-shield-check me-1 text-success"></i>
                All products verified through AyurTrace blockchain
              </small>
            </div>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
