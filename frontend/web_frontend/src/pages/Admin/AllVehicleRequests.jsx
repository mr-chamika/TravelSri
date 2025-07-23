import React from "react";

const vehicleRequests = [
  {
    number: "NS- 3847",
    type: "Seat 35 AC Bus",
    location: "Maharagama,Colombo",
  },
  {
    number: "WP- 1033",
    type: "Seat 12 AC Van(KDH)",
    location: "Matara",
  },
  {
    number: "KL-8834",
    type: "Seat 54 Bus",
    location: "Anuradhapura",
  },
  {
    number: "NC-8834",
    type: "Seat 54 Bus",
    location: "Polonnaruwa",
  },
];

const AllVehicleRequests = () => {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8">
        <div className="font-bold text-2xl md:text-4xl text-gray-800 mb-8 md:mb-12 text-center md:text-left">
          All Vehicle Requests
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          {vehicleRequests.map((vehicle) => (
            <div
              key={vehicle.number}
              className="flex flex-col md:flex-row items-center bg-gray-100 rounded-xl px-4 md:px-8 py-4 md:py-5"
            >
              {/* Vehicle Number */}
              <span className="font-medium text-base text-gray-800 w-full md:w-1/4 mb-2 md:mb-0">
                {vehicle.number}
              </span>
              {/* Seat and Location in one line */}
              <div className="flex flex-row items-center gap-8 flex-1 w-full md:w-2/3 mb-2 md:mb-0">
                <span className="text-sm text-gray-700">{vehicle.type}</span>
                <span className="text-sm text-gray-500 flex flex-row items-center gap-1">
                  <span>Location :</span>
                  <span className="whitespace-nowrap">{vehicle.location}</span>
                </span>
              </div>
              {/* View Button */}
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

export default AllVehicleRequests;


