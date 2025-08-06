import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // This is a placeholder dashboard that redirects to hotel dashboard
  React.useEffect(() => {
    // Automatically redirect to hotel dashboard
    navigate('/hotel/dashboard');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">TravelSri Dashboard</h1>
        <p className="mb-4">Redirecting to hotel dashboard...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default Dashboard;