import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            🌿 AyurTrace
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/verify">Verify Product</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">Login</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="bg-success text-white py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-4 fw-bold mb-4">
                  Welcome to AyurTrace
                </h1>
                <p className="lead mb-4">
                  Blockchain-powered supply chain traceability for Ayurvedic herbs in India. 
                  Ensuring authenticity, transparency, and trust from farm to consumer.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <a href="/verify" className="btn btn-light btn-lg">
                    <i className="fas fa-search me-2"></i>
                    Verify Product
                  </a>
                  <a href="/login" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Portal Login
                  </a>
                </div>
              </div>
              <div className="col-lg-4 text-center">
                <div className="bg-white rounded-3 p-4 shadow">
                  <div className="text-success mb-3">
                    <i className="fas fa-leaf" style={{fontSize: '4rem'}}></i>
                  </div>
                  <h5 className="text-dark">Blockchain Verified</h5>
                  <p className="text-muted small mb-0">
                    Every herb batch is tracked and verified on the blockchain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* Stats Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row text-center g-4">
              <div className="col-md-3">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h3 className="text-success mb-2">1,250+</h3>
                  <p className="text-muted mb-0">Verified Batches</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h3 className="text-success mb-2">85</h3>
                  <p className="text-muted mb-0">Registered Farmers</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h3 className="text-success mb-2">42</h3>
                  <p className="text-muted mb-0">Manufacturing Partners</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-white p-4 rounded shadow-sm">
                  <h3 className="text-success mb-2">15,000+</h3>
                  <p className="text-muted mb-0">Verified Products</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-5">How It Works</h2>
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="timeline">
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{minWidth: '50px', height: '50px'}}>
                      1
                    </div>
                    <div>
                      <h5>Farmer Registration</h5>
                      <p className="text-muted mb-0">Farmers register their herb batches with location and cultivation details</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{minWidth: '50px', height: '50px'}}>
                      2
                    </div>
                    <div>
                      <h5>Manufacturing Process</h5>
                      <p className="text-muted mb-0">Manufacturers process herbs and update quality test results</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{minWidth: '50px', height: '50px'}}>
                      3
                    </div>
                    <div>
                      <h5>Blockchain Recording</h5>
                      <p className="text-muted mb-0">All data is immutably recorded on the blockchain</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{minWidth: '50px', height: '50px'}}>
                      4
                    </div>
                    <div>
                      <h5>Consumer Verification</h5>
                      <p className="text-muted mb-0">Consumers can verify product authenticity using QR codes</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <div className="bg-light p-5 rounded">
                  <i className="fas fa-network-wired text-success mb-3" style={{fontSize: '4rem'}}></i>
                  <h4 className="mb-3">Secure & Transparent</h4>
                  <p className="text-muted">
                    Our blockchain-based system ensures complete transparency and security 
                    throughout the supply chain, building trust between all stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-success mb-3">🌿 AyurTrace</h5>
              <p className="mb-0">
                Revolutionizing Ayurvedic herb supply chain with blockchain technology.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="mb-2">
                <strong>Backend API:</strong>{' '}
                <span className="badge bg-success ms-2">
                  <a href="http://localhost:3001/api/health" className="text-white text-decoration-none">
                    Status Check
                  </a>
                </span>
              </div>
              <div className="text-muted small">
                &copy; 2024 AyurTrace. Built with ❤️ for authentic Ayurvedic herbs.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
