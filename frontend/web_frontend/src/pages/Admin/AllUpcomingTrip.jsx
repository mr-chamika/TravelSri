import React from "react";

const upcomingTrips = [
  {
    name: "Kandy Trip",
    date: "2025/06/17",
    remaining: 7,
  },
  {
    name: "Kandy Trip",
    date: "2025/06/20",
    remaining: 10,
  },
  {
    name: "Nuwara Eliya Trip",
    date: "2025/06/30",
    remaining: 20,
  },
  {
    name: "Anuradhapura Trip",
    date: "2025/07/02",
    remaining: 23,
  },
  {
    name: "Polonnaruwa Trip",
    date: "2025/07/18",
    remaining: 39,
  },
];

const AllUpcomingTrips = () => {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8">
        <div className="font-bold text-2xl md:text-4xl text-gray-800 mb-8 md:mb-12 text-left">
          All Upcoming Trips
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          {upcomingTrips.map((trip, idx) => (
            <div
              key={trip.name + trip.date}
              className="flex flex-col md:flex-row items-start md:items-center bg-gray-100 rounded-xl px-4 md:px-8 py-4 md:py-5"
            >
              <div className="flex-1 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-medium text-base text-gray-800">
                    {trip.name}
                  </span>
                  <span className="text-xs text-gray-500">{trip.date}</span>
                </div>
                <span className="text-sm text-gray-700 md:text-right">
                  Remaining Dates: {trip.remaining}
                </span>
              </div>
              <a href="/upcomingtripdetails" className="w-full md:w-auto">
                <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-4 md:px-6 py-1 mt-3 md:mt-0 md:ml-6 transition-colors duration-200 cursor-pointer w-full md:w-auto">
                    View
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUpcomingTrips;


