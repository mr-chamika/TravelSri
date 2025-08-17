import React, { useEffect, useState } from 'react';
import { hotelApiClient } from '../services/hotelAuthService';
import toast from 'react-hot-toast';

/**
 * Component that tests the connection to the backend API
 */
const ConnectionTest = () => {
  const [apiStatus, setApiStatus] = useState('idle');
  const [apiMessage, setApiMessage] = useState('');
  
  useEffect(() => {
    const testConnection = async () => {
      setApiStatus('loading');
      
      try {
        // Get the API URL
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        console.log('Testing connection to API:', apiUrl);
        
        // Test basic connectivity first
        try {
          const pingResponse = await fetch(`${apiUrl}/health`, { 
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
          });
          
          if (pingResponse.ok) {
            console.log('Basic API connectivity test passed');
          }
        } catch (pingError) {
          console.warn('Basic API ping failed:', pingError);
        }
        
        // Now test authenticated request
        const token = localStorage.getItem('hotelAuthToken');
        if (!token) {
          setApiMessage('No authentication token found. Please log in again.');
          setApiStatus('error');
          return;
        }
        
        // Try to get hotel profile with token
        const response = await hotelApiClient.get('/hotels/me');
        
        if (response.status === 200) {
          setApiMessage('Successfully connected to backend API');
          setApiStatus('success');
          toast.success('Backend connection successful!');
        } else {
          setApiMessage(`API returned status: ${response.status}`);
          setApiStatus('error');
          toast.error('API connection test returned an unexpected response');
        }
      } catch (error) {
        console.error('API connection test failed:', error);
        setApiMessage(error.message || 'Connection to backend API failed');
        setApiStatus('error');
        toast.error('Failed to connect to backend API');
      }
    };
    
    // Test connection when component mounts
    testConnection();
  }, []);
  
  // Styling based on status
  const getStatusColor = () => {
    switch (apiStatus) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'loading':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'loading':
        return 'hourglass_empty';
      default:
        return 'info';
    }
  };
  
  return (
    <div className={`border rounded-md p-4 ${getStatusColor()} mb-4`}>
      <div className="flex items-center">
        <span className="material-icons mr-2">{getStatusIcon()}</span>
        <h3 className="font-medium">API Connection Status</h3>
      </div>
      <p className="mt-2">{apiMessage || 'Testing connection to backend API...'}</p>
      
      {apiStatus === 'loading' && (
        <div className="mt-2 flex items-center">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
          <span>Testing connection...</span>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;
