import React, { useState } from 'react';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for properties
  const properties = [
    {
      id: 1,
      name: "Well Furnished Apartment",
      address: "100 Smart Street, LA, USA",
      image: "/images/property1.jpg",
      details: {
        singleRooms: 14,
        doubleRooms: 23,
        deluxRoom: 10,
        familyRooms: 8
      }
    },
    {
      id: 2,
      name: "Amazing Dream Building",
      address: "100 Smart Street, LA, USA",
      image: "/images/property2.jpg",
      details: {
        singleRooms: 14,
        doubleRooms: 23,
        deluxRoom: 10,
        familyRooms: 8
      }
    },
    {
      id: 3,
      name: "Boys Hostel Apartment",
      address: "100 Smart Street, LA, USA",
      image: "/images/property3.jpg",
      details: {
        singleRooms: 14,
        doubleRooms: 23,
        deluxRoom: 10,
        familyRooms: 8
      }
    },
    {
      id: 4,
      name: "Well Furnished Apartment",
      address: "100 Smart Street, LA, USA",
      image: "/images/property1.jpg",
      details: {
        singleRooms: 14,
        doubleRooms: 23,
        deluxRoom: 10,
        familyRooms: 8
      }
    },
    {
      id: 5,
      name: "Amazing Dream Building",
      address: "100 Smart Street, LA, USA",
      image: "/images/property2.jpg",
      details: {
        singleRooms: 14,
        doubleRooms: 23,
        deluxRoom: 10,
        familyRooms: 8
      }
    },
    {
      id: 6,
      name: "Boys Hostel Apartment",
      address: "100 Smart Street, LA, USA",
      image: "/images/property3.jpg",
      details: {
        singleRooms: 14,
        doubleRooms: 23,
        deluxRoom: 10,
        familyRooms: 8
      }
    }
  ];

  // Sample image URLs for fallbacks
  const sampleImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
  ];

  // Filter properties based on search
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Properties</h1>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400 material-icons">search</span>
        </div>
      </div>
      
      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property, index) => (
          <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="h-48 overflow-hidden">
              <img 
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = sampleImages[index % sampleImages.length];
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{property.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{property.address}</p>
              <div className="text-sm">
                <div>{property.details.singleRooms} Single Rooms | {property.details.doubleRooms} Double Rooms</div>
                <div>{property.details.deluxRoom} Delux Room | {property.details.familyRooms} Family Rooms</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;
