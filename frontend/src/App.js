import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

// Common Components
import ProtectedRoute, { AdminRoute, FarmerRoute, ManufacturerRoute, ConsumerRoute } from './components/common/ProtectedRoute';
import DashboardRedirect from './components/common/DashboardRedirect';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Error Pages
import UnauthorizedPage from './pages/errors/UnauthorizedPage';

// Dashboard Components
import AdminDashboard from './pages/admin/AdminDashboard';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  // This component can be enhanced later for public-only routes
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <Navigation />
            
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } 
                />
                
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  } 
                />

                {/* Dashboard Redirect */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardRedirect />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />

                {/* Farmer Routes */}
                <Route 
                  path="/farmer/dashboard" 
                  element={
                    <FarmerRoute>
                      <FarmerDashboard />
                    </FarmerRoute>
                  } 
                />

                {/* Manufacturer Routes */}
                <Route 
                  path="/manufacturer/dashboard" 
                  element={
                    <ManufacturerRoute>
                      <ManufacturerDashboard />
                    </ManufacturerRoute>
                  } 
                />

                {/* Consumer Routes */}
                <Route 
                  path="/consumer/dashboard" 
                  element={
                    <ConsumerRoute>
                      <ConsumerDashboard />
                    </ConsumerRoute>
                  } 
                />

                {/* Error Routes */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* 404 Fallback */}
                <Route 
                  path="*" 
                  element={
                    <div className="container mt-4 text-center">
                      <h1 className="display-4">404 - Page Not Found</h1>
                      <p className="lead">The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn btn-success">
                        <i className="fas fa-home me-2"></i>
                        Go Home
                      </a>
                    </div>
                  } 
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
