import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Protected route component that checks for authentication
 * and redirects to login if not authenticated
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // Check for token
      const token = localStorage.getItem('hotelAuthToken') || localStorage.getItem('token');
      
      if (!token) {
        console.log('No auth token found');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // Get user data
      const userData = localStorage.getItem('user') || localStorage.getItem('hotelUserData');
      
      if (!userData) {
        console.log('No user data found');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const userObj = JSON.parse(userData);
        const role = userObj?.role || 'guest';
        
        setUserRole(role);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If role is required but user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on actual role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'hotel':
        return <Navigate to="/hotel/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }
  
  // If authenticated and has required role, render children
  return children;
};

export default ProtectedRoute;
