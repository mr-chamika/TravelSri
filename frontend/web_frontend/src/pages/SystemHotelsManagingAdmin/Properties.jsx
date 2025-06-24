import React, { useState } from 'react';
import { MdSearch } from 'react-icons/md';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Mock data for properties with categories
  const properties = [
    {
      id: 1,
      name: "Well Furnished Apartment",
      address: "100 Smart Street, LA, USA",
      image: "/images/property1.jpg",
      category: "Apartments",
      details: {
        singleRooms: 14,
        doubleRooms: 23,
        deluxRoom: 10,
        familyRooms: 8
      }
    },
    {
      id: 2,
      name: "Grand Hotel",
      address: "45 Park Avenue, NY, USA",
      image: "/images/property2.jpg",
      category: "Hotels",
      details: {
        singleRooms: 25,
        doubleRooms: 42,
        deluxRoom: 15,
        familyRooms: 10
      }
    },
    {
      id: 3,
      name: "Seaside Villa",
      address: "12 Ocean Drive, Miami, USA",
      image: "/images/property3.jpg",
      category: "Villas",
      details: {
        singleRooms: 5,
        doubleRooms: 8,
        deluxRoom: 3,
        familyRooms: 4
      }
    },
    {
      id: 4,
      name: "City Center Hotel",
      address: "78 Main Street, Chicago, USA",
      image: "/images/property4.jpg",
      category: "Hotels",
      details: {
        singleRooms: 30,
        doubleRooms: 45,
        deluxRoom: 20,
        familyRooms: 12
      }
    },
    {
      id: 5,
      name: "Mountain View Villa",
      address: "25 Highland Road, Denver, USA",
      image: "/images/property5.jpg",
      category: "Villas",
      details: {
        singleRooms: 6,
        doubleRooms: 7,
        deluxRoom: 4,
        familyRooms: 3
      }
    },
    {
      id: 6,
      name: "Urban Loft Apartments",
      address: "92 Downtown Blvd, San Francisco, USA",
      image: "/images/property6.jpg",
      category: "Apartments",
      details: {
        singleRooms: 18,
        doubleRooms: 12,
        deluxRoom: 8,
        familyRooms: 5
      }
    }
  ];

  // Sample image URLs for fallbacks
  const sampleImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80'
  ];

  // Count properties by category
  const categoryCounts = {
    All: properties.length,
    Hotels: properties.filter(property => property.category === "Hotels").length,
    Apartments: properties.filter(property => property.category === "Apartments").length,
    Villas: properties.filter(property => property.category === "Villas").length
  };

  // Filter properties based on search and category
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === 'All') {
      return matchesSearch;
    } else {
      return matchesSearch && property.category === activeCategory;
    }
  });
  
  // Function to open property details modal
  const openPropertyDetails = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Extended property data with additional details
  const propertyExtendedData = {
    1: {
      description: "Stylish and modern furnished apartment in the heart of downtown. Perfect for business travelers and small families.",
      amenities: ["Wi-Fi", "Air Conditioning", "Kitchen", "Washer", "Dryer", "Parking", "Pool", "Gym"],
      rating: 4.8,
      reviews: 124,
      priceRange: "$150-$250 per night",
      contactInfo: {
        phone: "+1 (323) 555-1234",
        email: "info@furnishedapt.com",
        website: "www.furnishedapt.com"
      },
      manager: "Alice Williams",
      status: "Active",
      joinedDate: "2022-03-15"
    },
    2: {
      description: "Luxurious hotel with exceptional service and premium amenities. Located in the city center with easy access to attractions.",
      amenities: ["Wi-Fi", "Room Service", "Restaurant", "Bar", "Spa", "Gym", "Swimming Pool", "Conference Room"],
      rating: 4.9,
      reviews: 356,
      priceRange: "$250-$500 per night",
      contactInfo: {
        phone: "+1 (212) 555-6789",
        email: "reservations@grandhotel.com",
        website: "www.grandhotel.com"
      },
      manager: "Robert Johnson",
      status: "Active",
      joinedDate: "2021-11-05"
    },
    3: {
      description: "Beautiful seaside villa with stunning ocean views. Ideal for relaxing vacations and family gatherings.",
      amenities: ["Wi-Fi", "Air Conditioning", "Kitchen", "Private Pool", "Beachfront", "Parking"],
      rating: 4.7,
      reviews: 98,
      priceRange: "$200-$400 per night",
      contactInfo: {
        phone: "+1 (305) 555-7890",
        email: "info@seasidevilla.com",
        website: "www.seasidevilla.com"
      },
      manager: "Carlos Martinez",
      status: "Active",
      joinedDate: "2023-01-10"
    },
    4: {
      description: "Elegant hotel in the city center, close to shopping and dining. Offers modern rooms and top-notch amenities.",
      amenities: ["Wi-Fi", "Room Service", "Restaurant", "Bar", "Gym", "Business Center"],
      rating: 4.6,
      reviews: 210,
      priceRange: "$180-$350 per night",
      contactInfo: {
        phone: "+1 (312) 555-4567",
        email: "contact@citycenterhotel.com",
        website: "www.citycenterhotel.com"
      },
      manager: "Emily Davis",
      status: "Active",
      joinedDate: "2022-07-22"
    },
    5: {
      description: "Cozy mountain villa with breathtaking views and easy access to hiking trails. Perfect for nature lovers.",
      amenities: ["Wi-Fi", "Fireplace", "Kitchen", "Parking", "Ski-in/Ski-out"],
      rating: 4.9,
      reviews: 76,
      priceRange: "$220-$380 per night",
      contactInfo: {
        phone: "+1 (970) 555-2345",
        email: "info@mountainviewvilla.com",
        website: "www.mountainviewvilla.com"
      },
      manager: "David Wilson",
      status: "Active",
      joinedDate: "2023-02-18"
    },
    6: {
      description: "Modern urban loft with stylish decor and convenient amenities. Located in the heart of the city.",
      amenities: ["Wi-Fi", "Air Conditioning", "Kitchen", "Washer", "Dryer", "Parking"],
      rating: 4.5,
      reviews: 134,
      priceRange: "$130-$270 per night",
      contactInfo: {
        phone: "+1 (415) 555-6789",
        email: "info@urbanloft.com",
        website: "www.urbanloft.com"
      },
      manager: "Sophia Brown",
      status: "Active",
      joinedDate: "2022-11-30"
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Properties</h1>
      
      {/* Category tabs and search */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md whitespace-nowrap 
                ${activeCategory === category 
                  ? 'bg-yellow-400 text-black font-medium' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setActiveCategory(category)}
            >
              {category} ({count})
            </button>
          ))}
        </div>
        
        {/* Search bar */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdSearch className="absolute left-3 top-2.5 text-gray-400 text-xl" />
        </div>
      </div>
      
      {/* Results count */}
      <p className="text-gray-500 mb-6">
        {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
      </p>
      
      {/* Property Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    e.target.src = sampleImages[index % sampleImages.length];
                  }}
                />
                <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 m-2 rounded">
                  {property.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{property.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{property.address}</p>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>{property.details.singleRooms} Single Rooms</span>
                    <span>{property.details.doubleRooms} Double Rooms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{property.details.deluxRoom} Delux Room</span>
                    <span>{property.details.familyRooms} Family Rooms</span>
                  </div>
                </div>
                <button 
                  className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-md text-sm font-medium transition"
                  onClick={() => openPropertyDetails(property)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-xl text-gray-700 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Property Details Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">{selectedProperty.name}</h2>
              <button 
                onClick={closeModal} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Property Image */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={selectedProperty.image}
                alt={selectedProperty.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const index = selectedProperty.id % sampleImages.length;
                  e.target.src = sampleImages[index];
                }}
              />
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 m-4 rounded">
                {selectedProperty.category}
              </div>
            </div>
            
            {/* Property Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info Column */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">About</h3>
                    <p className="text-gray-600">
                      {propertyExtendedData[selectedProperty.id]?.description || 
                       "A beautiful property with modern amenities and comfortable accommodations."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Room Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Single Rooms</p>
                        <p className="text-xl font-semibold">{selectedProperty.details.singleRooms}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Double Rooms</p>
                        <p className="text-xl font-semibold">{selectedProperty.details.doubleRooms}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Deluxe Rooms</p>
                        <p className="text-xl font-semibold">{selectedProperty.details.deluxRoom}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-500">Family Rooms</p>
                        <p className="text-xl font-semibold">{selectedProperty.details.familyRooms}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {propertyExtendedData[selectedProperty.id]?.amenities?.map((amenity, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      )) || 
                      ["Wi-Fi", "AC", "Kitchen", "Parking"].map((amenity, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Location</h3>
                    <p className="text-gray-600">{selectedProperty.address}</p>
                    {/* Placeholder for a map - in a real app you would integrate Google Maps here */}
                    <div className="bg-gray-200 h-40 mt-2 rounded-md flex items-center justify-center text-gray-500">
                      Map placeholder
                    </div>
                  </div>
                </div>
                
                {/* Sidebar with Stats & Contact */}
                <div className="space-y-4">
                  {/* Status Card */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Property Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {propertyExtendedData[selectedProperty.id]?.status || "Active"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-semibold flex items-center">
                          {propertyExtendedData[selectedProperty.id]?.rating || "4.5"}
                          <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Rooms:</span>
                        <span className="font-semibold">
                          {selectedProperty.details.singleRooms + 
                           selectedProperty.details.doubleRooms + 
                           selectedProperty.details.deluxRoom + 
                           selectedProperty.details.familyRooms}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Range:</span>
                        <span className="font-semibold">{propertyExtendedData[selectedProperty.id]?.priceRange || "$100-$300"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="font-medium">
                          {propertyExtendedData[selectedProperty.id]?.contactInfo?.phone || "+1 (555) 123-4567"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="font-medium">
                          {propertyExtendedData[selectedProperty.id]?.contactInfo?.email || "contact@example.com"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Website</p>
                        <p className="font-medium text-blue-600 hover:underline">
                          {propertyExtendedData[selectedProperty.id]?.contactInfo?.website || "www.example.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Manager */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Property Manager</h4>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        {(propertyExtendedData[selectedProperty.id]?.manager || "Property Manager")[0]}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{propertyExtendedData[selectedProperty.id]?.manager || "Property Manager"}</p>
                        <p className="text-xs text-gray-500">Joined {propertyExtendedData[selectedProperty.id]?.joinedDate || "Jan 2022"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
