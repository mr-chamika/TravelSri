import React from "react";

const hotelRequests = [
  { name: "Hotel Kandian", location: "Kandy" },
  { name: "Sinhagiri Hotel", location: "Sigiriya" },
  { name: "Ella Villa", location: "Ella, Badulla" },
];

const AllHotelRequests = () => {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8">
        <div className="font-bold text-2xl md:text-4xl text-gray-800 mb-8 md:mb-12 text-center md:text-left">
          All Hotel Requests
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          {hotelRequests.map((hotel, idx) => (
            <div
              key={hotel.name}
              className="flex flex-col md:flex-row items-start md:items-center bg-gray-100 rounded-xl px-4 md:px-8 py-4 md:py-5"
            >
              <div className="flex-1 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <span className="font-medium text-base text-gray-800">{hotel.name}</span>
                <span className="text-sm text-gray-500 md:text-right">
                  location : {hotel.location}
                </span>
              </div>
              <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-4 md:px-6 py-1 mt-3 md:mt-0 md:ml-6 transition-colors duration-200 cursor-pointer w-full md:w-auto">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllHotelRequests;


