import React from "react";

const guidesRequests = [
  {
    name: "L.K. Samantha",
    experience: "2 year experience",
    location: "Galle",
  },
  {
    name: "Arun Shankar",
    experience: "3 year experience",
    location: "Nuwara Eliya",
  },
  {
    name: "Deshan Thathsara",
    experience: "4year experience",
    location: "Matara",
  },
];

const AllGuidesRequests = () => {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-5xl min-h-[400px] p-4 md:p-8">
        <div className="font-bold text-2xl md:text-4xl text-gray-800 mb-8 md:mb-12 text-center md:text-left">
          All Guides Requests
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          {guidesRequests.map((guide) => (
            <div
              key={guide.name}
              className="flex flex-col md:flex-row items-center bg-gray-100 rounded-xl px-4 md:px-8 py-4 md:py-5"
            >
              <div className="flex-1 w-full flex flex-row items-center gap-8">
                <span className="font-medium text-base text-gray-800">
                  {guide.name}
                </span>
                <span className="text-sm text-gray-700">
                  {guide.experience}
                </span>
                <span className="text-sm text-gray-500">
                  Location : {guide.location}
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

export default AllGuidesRequests;


