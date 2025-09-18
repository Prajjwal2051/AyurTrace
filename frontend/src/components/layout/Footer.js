import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-md-4 mb-3">
            <h5 className="text-success mb-3">
              <i className="fas fa-leaf me-2"></i>
              AyurTrace
            </h5>
            <p className="mb-2">
              Revolutionizing Ayurvedic herb supply chain with blockchain technology for authentic, traceable, and trusted products.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com/AyurTrace" className="text-light" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="https://twitter.com/AyurTrace" className="text-light" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="https://linkedin.com/company/ayurtrace" className="text-light" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a href="https://instagram.com/ayurtrace" className="text-light" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-3">
            <h6 className="text-success mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  <i className="fas fa-home me-2"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">
                  <i className="fas fa-info-circle me-2"></i>About
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-light text-decoration-none">
                  <i className="fas fa-envelope me-2"></i>Contact
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/consumer/verify" className="text-light text-decoration-none">
                  <i className="fas fa-search me-2"></i>Verify Product
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-md-2 mb-3">
            <h6 className="text-success mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/privacy" className="text-light text-decoration-none">
                  <i className="fas fa-shield-alt me-2"></i>Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-light text-decoration-none">
                  <i className="fas fa-file-contract me-2"></i>Terms of Service
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cookies" className="text-light text-decoration-none">
                  <i className="fas fa-cookie-bite me-2"></i>Cookie Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/compliance" className="text-light text-decoration-none">
                  <i className="fas fa-balance-scale me-2"></i>Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & System Status */}
          <div className="col-md-4 mb-3">
            <h6 className="text-success mb-3">System Status</h6>
            
            {/* API Status */}
            <div className="mb-2">
              <span className="badge bg-success me-2">
                <i className="fas fa-circle"></i>
              </span>
              <small>API Status: Operational</small>
            </div>

            {/* Blockchain Status */}
            <div className="mb-2">
              <span className="badge bg-warning me-2">
                <i className="fas fa-circle"></i>
              </span>
              <small>Blockchain: Demo Mode</small>
            </div>

            {/* Database Status */}
            <div className="mb-3">
              <span className="badge bg-info me-2">
                <i className="fas fa-circle"></i>
              </span>
              <small>Database: Mock Data</small>
            </div>

            <div className="border-top border-secondary pt-3">
              <h6 className="text-success mb-2">Support</h6>
              <div className="mb-1">
                <i className="fas fa-envelope me-2"></i>
                <small>support@ayurtrace.com</small>
              </div>
              <div className="mb-1">
                <i className="fas fa-phone me-2"></i>
                <small>+91 98765 43210</small>
              </div>
              <div>
                <i className="fas fa-map-marker-alt me-2"></i>
                <small>New Delhi, India</small>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        {/* Bottom Section */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted small">
              &copy; 2024 AyurTrace. Built with ❤️ for authentic Ayurvedic herbs.
              <br />
              <strong>Smart India Hackathon 2025</strong> - Addressing ₹5,000+ crore fake product problem.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end align-items-center gap-3 mt-2 mt-md-0">
              <small className="text-muted">Powered by:</small>
              <div className="d-flex gap-2">
                <span className="badge bg-secondary">
                  <i className="fab fa-react me-1"></i>React
                </span>
                <span className="badge bg-secondary">
                  <i className="fab fa-node-js me-1"></i>Node.js
                </span>
                <span className="badge bg-secondary">
                  <i className="fas fa-link me-1"></i>Blockchain
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
