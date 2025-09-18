import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import localStorageManager from '../utils/localStorage';
import AnimationEffects, { SparkleButton, LoadingAnimation } from '../components/common/AnimationEffects';
import DataExportManager from '../components/common/DataExportManager';
import { colorPalette, getGradient, shadows } from '../styles/colorPalette';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalFarmers: 0,
    totalProducts: 0,
    verifications: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sparkleElements, setSparkleElements] = useState([]);
  const [animatedStats, setAnimatedStats] = useState({
    totalBatches: 0,
    totalFarmers: 0,
    totalProducts: 0,
    verifications: 0
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [showExportManager, setShowExportManager] = useState(false);

  const supplyChainSteps = [
    { name: '🌱 Collection', color: 'success', description: 'Herb harvesting from certified farms' },
    { name: '📦 Processing', color: 'warning', description: 'Quality testing and initial processing' },
    { name: '🏭 Manufacturing', color: 'info', description: 'Product creation and packaging' },
    { name: '🏪 Retail', color: 'primary', description: 'Distribution to retail partners' },
    { name: '👤 Consumer', color: 'success', description: 'Final verification by consumers' }
  ];

  // Animate counter function
  const animateCounter = (start, end, duration, setter, key) => {
    if (start === end) return;
    
    const range = end - start;
    const increment = range > 0 ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      setter(prev => ({ ...prev, [key]: current }));
      
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime > 0 ? stepTime : 1);
  };

  // Calculate additional metrics
  const calculateAdvancedMetrics = (batches, products, verifications) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      todayVerifications: verifications.filter(v => 
        new Date(v.verificationDate) >= today
      ).length,
      weeklyBatches: batches.filter(b => 
        new Date(b.createdAt) >= thisWeek
      ).length,
      monthlyProducts: products.filter(p => 
        new Date(p.createdAt) >= thisMonth
      ).length,
      averageQuality: batches.length > 0 
        ? Math.round(batches.reduce((acc, b) => acc + (b.qualityScore || 85), 0) / batches.length)
        : 0
    };
  };

  useEffect(() => {
    // Load real-time statistics
    const loadStats = () => {
      try {
        setIsStatsLoading(true);
        
        const batches = localStorageManager.getBatches();
        const products = localStorageManager.getProducts();
        const verifications = localStorageManager.getVerifications();
        
        const newStats = {
          totalBatches: batches.length,
          totalFarmers: new Set(batches.map(b => b.farmerId)).size,
          totalProducts: products.length,
          verifications: verifications.length
        };
        
        // Calculate advanced metrics
        const advancedMetrics = calculateAdvancedMetrics(batches, products, verifications);
        
        setStats({ ...newStats, ...advancedMetrics });
        
        // Animate counters with staggered timing
        setTimeout(() => {
          animateCounter(animatedStats.totalBatches, newStats.totalBatches, 1000, setAnimatedStats, 'totalBatches');
        }, 200);
        setTimeout(() => {
          animateCounter(animatedStats.totalFarmers, newStats.totalFarmers, 1000, setAnimatedStats, 'totalFarmers');
        }, 400);
        setTimeout(() => {
          animateCounter(animatedStats.totalProducts, newStats.totalProducts, 1000, setAnimatedStats, 'totalProducts');
        }, 600);
        setTimeout(() => {
          animateCounter(animatedStats.verifications, newStats.verifications, 1000, setAnimatedStats, 'verifications');
        }, 800);
        
        setTimeout(() => setIsStatsLoading(false), 1200);

        // Create recent activity feed
        const activities = [
          ...batches.slice(-3).map(batch => ({
            id: batch.id,
            type: 'harvest',
            description: `🌱 New ${batch.crop} batch harvested by ${batch.farmerName}`,
            timestamp: batch.createdAt,
            icon: '🌱',
            color: 'success'
          })),
          ...products.slice(-2).map(product => ({
            id: product.id,
            type: 'process',
            description: `🏭 ${product.productName} processed and quality tested`,
            timestamp: product.createdAt,
            icon: '🏭',
            color: 'warning'
          })),
          ...verifications.slice(-2).map(verification => ({
            id: verification.id,
            type: 'verify',
            description: `✅ Product verified by consumer in ${verification.location}`,
            timestamp: verification.verificationDate,
            icon: '✅',
            color: 'info'
          }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
        
        setRecentActivity(activities);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
    
    // Update stats every 10 seconds for live effect
    const interval = setInterval(loadStats, 10000);
    
    // Animate supply chain steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % supplyChainSteps.length);
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      switch (user.role) {
        case 'farmer':
          navigate('/farmer/dashboard');
          break;
        case 'manufacturer':
          navigate('/manufacturer/dashboard');
          break;
        case 'consumer':
          navigate('/consumer/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const addSparkleEffect = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sparkle = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setSparkleElements(prev => [...prev, sparkle]);
    
    setTimeout(() => {
      setSparkleElements(prev => prev.filter(s => s.id !== sparkle.id));
    }, 2000);
  };

  return (
    <AnimationEffects enableSparkles={true} enableParticles={false} enableHoverGlow={true}>
      <div className="homepage" style={{
        background: getGradient('hero'),
        minHeight: '100vh',
        position: 'relative'
      }}>
      {/* Modern Hero Section with Glassmorphism */}
      <section className="py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          {/* Header Card */}
          <div className="text-center mb-5">
            <div style={{
              background: colorPalette.glass.white,
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: shadows.xl,
              border: `1px solid ${colorPalette.glass.border}`
            }}>
              <div style={{
                fontSize: '2.5em',
                fontWeight: 'bold',
                background: getGradient('primary'),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px'
              }}>
                🌿 AyurTrace
              </div>
              <div style={{ color: '#666', fontSize: '1.1em' }}>
                Blockchain-Powered Ayurvedic Herb Traceability Platform
              </div>
            </div>
          </div>

          {/* Interactive Supply Chain Visualization */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div style={{
                background: colorPalette.glass.white,
                backdropFilter: 'blur(15px)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: shadows.xl
              }}>
                <h3 className="text-center mb-4">Supply Chain Journey</h3>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  {supplyChainSteps.map((step, index) => (
                    <div key={index} className="d-flex flex-column align-items-center position-relative" style={{
                      margin: '10px',
                      transition: 'transform 0.3s ease',
                      transform: currentStep === index ? 'scale(1.1)' : 'scale(1)'
                    }}>
                      <div style={{
                        background: currentStep === index 
                          ? getGradient('primary')
                          : getGradient('card'),
                        color: currentStep === index ? 'white' : colorPalette.neutral[600],
                        padding: '20px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        minWidth: '150px',
                        transition: 'all 0.3s ease',
                        boxShadow: currentStep === index 
                          ? shadows.glow
                          : shadows.md,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={addSparkleEffect}>
                        <div style={{ fontSize: '1.2em', fontWeight: '600' }}>{step.name}</div>
                        <div style={{ fontSize: '0.8em', marginTop: '5px', opacity: 0.8 }}>
                          {step.description}
                        </div>
                      </div>
                      {index < supplyChainSteps.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          right: '-25px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '20px',
                          color: colorPalette.primary[500],
                          zIndex: 1
                        }}>→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Key Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="fas fa-seedling" style={{fontSize: '2.5rem'}}></i>
                  </div>
                  <h5 className="card-title">Farm to Consumer</h5>
                  <p className="card-text text-muted">
                    Complete traceability from farm cultivation to final consumer delivery.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="fas fa-shield-alt" style={{fontSize: '2.5rem'}}></i>
                  </div>
                  <h5 className="card-title">Blockchain Security</h5>
                  <p className="card-text text-muted">
                    Immutable records powered by Hyperledger Fabric blockchain technology.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="fas fa-qrcode" style={{fontSize: '2.5rem'}}></i>
                  </div>
                  <h5 className="card-title">QR Code Verification</h5>
                  <p className="card-text text-muted">
                    Instant product verification with dynamic QR codes and GPS tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* Live Statistics Dashboard */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, marginRight: '15px' }}>📊 Live Platform Statistics</h3>
                    {isStatsLoading && (
                      <LoadingAnimation type="dots" size={24} color="#4CAF50" />
                    )}
                  </div>
                  
                  {/* Export Button */}
                  <button
                    onClick={() => setShowExportManager(true)}
                    style={{
                      background: 'linear-gradient(45deg, #17a2b8, #20c997)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 18px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 5px 15px rgba(23, 162, 184, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(23, 162, 184, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 5px 15px rgba(23, 162, 184, 0.3)';
                    }}
                  >
                    📄 Export Data
                  </button>
                </div>
                
                {/* Primary Statistics */}
                <div className="row text-center g-4 mb-4">
                  <div className="col-md-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '20px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      boxShadow: '0 15px 35px rgba(76, 175, 80, 0.1)',
                      border: '1px solid rgba(76, 175, 80, 0.1)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="dashboard-card enhanced-card"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(76, 175, 80, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(76, 175, 80, 0.1)';
                    }}>
                      {/* Animated background effect */}
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(45deg, transparent, rgba(76, 175, 80, 0.05), transparent)',
                        animation: 'shimmer 3s ease-in-out infinite',
                        pointerEvents: 'none'
                      }}></div>
                      <div style={{
                        fontSize: '48px',
                        marginBottom: '10px'
                      }}>🌱</div>
                      <div style={{
                        fontSize: '2.8em',
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>
                        {animatedStats.totalBatches}
                      </div>
                      <div style={{ color: '#666', fontWeight: '600', fontSize: '14px' }}>Total Herb Batches</div>
                      <div style={{
                        marginTop: '10px',
                        fontSize: '12px',
                        color: '#4CAF50',
                        fontWeight: '500'
                      }}>
                        +{stats.weeklyBatches || 0} this week
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '20px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      boxShadow: '0 15px 35px rgba(255, 193, 7, 0.1)',
                      border: '1px solid rgba(255, 193, 7, 0.1)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="dashboard-card enhanced-card"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(255, 193, 7, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 193, 7, 0.1)';
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(45deg, transparent, rgba(255, 193, 7, 0.05), transparent)',
                        animation: 'shimmer 3s ease-in-out infinite 0.5s',
                        pointerEvents: 'none'
                      }}></div>
                      <div style={{
                        fontSize: '48px',
                        marginBottom: '10px'
                      }}>👨‍🌾</div>
                      <div style={{
                        fontSize: '2.8em',
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, #ffc107, #fd7e14)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>
                        {animatedStats.totalFarmers}
                      </div>
                      <div style={{ color: '#666', fontWeight: '600', fontSize: '14px' }}>Registered Farmers</div>
                      <div style={{
                        marginTop: '10px',
                        fontSize: '12px',
                        color: '#ffc107',
                        fontWeight: '500'
                      }}>
                        Quality Score: {stats.averageQuality || 0}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '20px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      boxShadow: '0 15px 35px rgba(0, 123, 255, 0.1)',
                      border: '1px solid rgba(0, 123, 255, 0.1)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="dashboard-card enhanced-card"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 123, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 123, 255, 0.1)';
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(45deg, transparent, rgba(0, 123, 255, 0.05), transparent)',
                        animation: 'shimmer 3s ease-in-out infinite 1s',
                        pointerEvents: 'none'
                      }}></div>
                      <div style={{
                        fontSize: '48px',
                        marginBottom: '10px'
                      }}>📦</div>
                      <div style={{
                        fontSize: '2.8em',
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, #007bff, #0056b3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>
                        {animatedStats.totalProducts}
                      </div>
                      <div style={{ color: '#666', fontWeight: '600', fontSize: '14px' }}>Products in Market</div>
                      <div style={{
                        marginTop: '10px',
                        fontSize: '12px',
                        color: '#007bff',
                        fontWeight: '500'
                      }}>
                        +{stats.monthlyProducts || 0} this month
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      borderRadius: '20px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      boxShadow: '0 15px 35px rgba(40, 167, 69, 0.1)',
                      border: '1px solid rgba(40, 167, 69, 0.1)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    className="dashboard-card enhanced-card"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(40, 167, 69, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(40, 167, 69, 0.1)';
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(45deg, transparent, rgba(40, 167, 69, 0.05), transparent)',
                        animation: 'shimmer 3s ease-in-out infinite 1.5s',
                        pointerEvents: 'none'
                      }}></div>
                      <div style={{
                        fontSize: '48px',
                        marginBottom: '10px'
                      }}>✅</div>
                      <div style={{
                        fontSize: '2.8em',
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, #28a745, #20c997)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>
                        {animatedStats.verifications}
                      </div>
                      <div style={{ color: '#666', fontWeight: '600', fontSize: '14px' }}>Consumer Verifications</div>
                      <div style={{
                        marginTop: '10px',
                        fontSize: '12px',
                        color: '#28a745',
                        fontWeight: '500'
                      }}>
                        +{stats.todayVerifications || 0} today
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Activity Feed */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <h3 className="text-center mb-4">📰 Recent Activity</h3>
                <div className="timeline" style={{ position: 'relative' }}>
                  {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                    <div key={activity.id} style={{
                      background: 'white',
                      borderRadius: '10px',
                      padding: '20px',
                      margin: '15px 0',
                      position: 'relative',
                      borderLeft: '4px solid #4CAF50',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(10px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                      <div style={{
                        color: '#666',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '16px' }}>
                        {activity.description}
                      </div>
                    </div>
                  )) : (
                    <div style={{
                      background: 'white',
                      borderRadius: '10px',
                      padding: '20px',
                      margin: '15px 0',
                      textAlign: 'center',
                      color: '#666'
                    }}>
                      No recent activity. Start by exploring the platform!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <h4 className="mb-4">🚀 Ready to Get Started?</h4>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  {isAuthenticated ? (
                    <SparkleButton 
                      onClick={handleGetStarted}
                      sparkleColor="#FFD700"
                      style={{
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        color: 'white',
                        padding: '15px 30px',
                        border: 'none',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                        position: 'relative'
                      }}
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      🎆 Go to Dashboard
                    </SparkleButton>
                  ) : (
                    <>
                      <SparkleButton
                        onClick={() => navigate('/register')}
                        sparkleColor="#4ECDC4"
                        style={{
                          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                          color: 'white',
                          padding: '15px 30px',
                          border: 'none',
                          borderRadius: '15px',
                          fontSize: '16px',
                          fontWeight: '600',
                          boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                          marginRight: '10px'
                        }}
                      >
                        <i className="fas fa-user-plus me-2"></i>
                        🌟 Get Started
                      </SparkleButton>
                      <SparkleButton
                        onClick={() => navigate('/login')}
                        sparkleColor="#45B7D1"
                        style={{
                          background: 'linear-gradient(45deg, #6c757d, #495057)',
                          color: 'white',
                          padding: '15px 30px',
                          border: 'none',
                          borderRadius: '15px',
                          fontSize: '16px',
                          fontWeight: '600',
                          boxShadow: '0 8px 25px rgba(108, 117, 125, 0.3)'
                        }}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>
                        🗺️ Portal Login
                      </SparkleButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sparkle Effects */}
        {sparkleElements.map(sparkle => (
          <div
            key={sparkle.id}
            style={{
              position: 'absolute',
              left: sparkle.x,
              top: sparkle.y,
              fontSize: '20px',
              pointerEvents: 'none',
              zIndex: 1000,
              animation: 'sparkleFloat 2s ease-out forwards'
            }}
          >
            ✨
          </div>
        ))}
      </section>
      
      {/* Add CSS animation for sparkles and other effects */}
      <style>{`
        @keyframes sparkleFloat {
          0% { transform: translateY(0) scale(0); opacity: 1; }
          50% { transform: translateY(-20px) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(0); opacity: 0; }
        }
        
        .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          50% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) translateY(200%) rotate(45deg);
          }
        }
        
        @keyframes counterUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .dashboard-card {
          transition: all 0.3s ease;
        }
        
        .enhanced-card {
          animation: counterUp 0.6s ease-out forwards;
        }
        
        .enhanced-card:nth-child(1) { animation-delay: 0.1s; }
        .enhanced-card:nth-child(2) { animation-delay: 0.2s; }
        .enhanced-card:nth-child(3) { animation-delay: 0.3s; }
        .enhanced-card:nth-child(4) { animation-delay: 0.4s; }
        
        @media (max-width: 768px) {
          .supply-chain {
            flex-direction: column;
          }
        
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        
        .sparkle-button:hover {
          transform: translateY(-3px) scale(1.05) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
        }
        }
      `}</style>
      </div>
      
      {/* Data Export Manager Modal */}
      {showExportManager && (
        <DataExportManager onClose={() => setShowExportManager(false)} />
      )}
    </AnimationEffects>
  );
};

export default HomePage;
