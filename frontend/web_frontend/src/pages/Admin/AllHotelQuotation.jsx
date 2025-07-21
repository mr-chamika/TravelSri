import React, { useState } from "react";

const hotelQuotations = [
  {
    name: "Marriot",
    price: "Rs. 100,000/-",
  },
  {
    name: "Hotel Marina",
    price: "Rs. 110,000/-",
  },
  {
    name: "Family Villa",
    price: "Rs. 135,000/-",
  },
];

const AllHotelQuotation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
       

        {/* Page Content */}
        <div className="flex-1 bg-gray-100 py-4 px-2 flex justify-center items-start">
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <h1 className="font-bold text-2xl md:text-3xl text-gray-800 mb-2">
                Kandy Trip <span className="text-gray-500 font-normal text-lg">(All hotels quotations)</span>
              </h1>
            </div>

            {/* Hotel Quotations List */}
            <div className="flex flex-col gap-4 md:gap-6 mb-8">
              {hotelQuotations.map((hotel, idx) => (
                <div
                  key={hotel.name}
                  className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-100 rounded-xl px-4 md:px-6 py-4 md:py-5"
                >
                  <div className="flex-1 w-full mb-3 sm:mb-0">
                    <div className="font-medium text-base md:text-lg text-gray-800 mb-1">
                      {hotel.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {hotel.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded px-4 py-1 text-sm transition-colors duration-200">
                      View
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <a href="/pendingtripdetails" className="w-full sm:w-auto">
                <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-8 py-2 transition-colors duration-200 cursor-pointer">
                    Continue
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllHotelQuotation;