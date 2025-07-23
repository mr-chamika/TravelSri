import React, { useState } from "react";

const CancelTrip = () => {
  const [reason, setReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for deleting the trip.");
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      window.location.href = "/upcomingtripdetails";
    }, 1800); // Show success for 1.8s then redirect
  };

  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-8 px-2 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-3xl min-h-[500px] p-6 md:p-12 flex flex-col items-center justify-center">
        {showSuccess ? (
          <div className="bg-gray-200 rounded-2xl w-full max-w-2xl p-16 flex flex-col items-center justify-center">
            <div className="bg-blue-500 rounded-full w-24 h-24 flex items-center justify-center mb-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#3B82F6"/>
                <path d="M16 25l6 6 10-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-2xl md:text-2xl font-semibold text-gray-700 text-center">
              Successfully delete the trip
            </div>
          </div>
        ) : (
          <div className="bg-gray-200 rounded-2xl w-full max-w-2xl p-8 flex flex-col items-center">
            <div className="font-bold text-3xl md:text-4xl text-gray-800 mb-2 text-center">
              Delete a Trip
            </div>
            <div className="text-xl font-semibold text-gray-700 mb-6 text-center">
              Are you sure you want to delete <span className="font-bold text-black">that Trip ?</span>
            </div>
            {/* Warning */}
            <div className="w-full mb-6">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-center">
                <span className="mr-2 text-2xl">⚠️</span>
                <div>
                  <span className="font-bold">Warning</span>
                  <div className="text-sm mt-1">
                    By Deleting this trip, automatically cancel the allocated hotel, vehicle and guide. Admin should type the reason.
                  </div>
                </div>
              </div>
            </div>
            {/* Reason Input */}
            <textarea
              className="w-full bg-[#f5e7df] rounded-lg p-4 text-lg text-gray-700 mb-8 outline-none border-none resize-none placeholder-gray-500"
              rows={2}
              placeholder="admin type here the reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            {/* Buttons */}
            <div className="flex w-full justify-between mt-2">
              <button
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded px-6 py-2 transition-colors duration-200 cursor-pointer"
                onClick={() => window.history.back()}
              >
                No, Cancel
              </button>
              <button
                className="bg-red-400 hover:bg-red-600 text-white font-semibold rounded px-6 py-2 transition-colors duration-200 cursor-pointer"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelTrip;