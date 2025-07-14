import React from 'react';

const FeedbackFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const serviceTypes = ['all', 'Room Service', 'Restaurant', 'Front Desk', 'Housekeeping', 'Spa', 'Amenities'];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="font-medium mb-3">Filter Reviews</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Status Filter */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="all">All Reviews</option>
            <option value="replied">Replied</option>
            <option value="unreplied">Awaiting Response</option>
          </select>
        </div>
        
        {/* Rating Filter */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Rating</label>
          <select 
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        
        {/* Service Type Filter */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Service Type</label>
          <select 
            value={filters.serviceType}
            onChange={(e) => handleFilterChange('serviceType', e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            {serviceTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Services' : type}
              </option>
            ))}
          </select>
        </div>
        
        {/* Search */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Search</label>
          <input 
            type="text" 
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search reviews or guests..."
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackFilters;
