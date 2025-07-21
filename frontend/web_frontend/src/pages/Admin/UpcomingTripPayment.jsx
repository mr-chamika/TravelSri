import React from "react";

const paymentData = {
  tripName: "Kandy Trips",
  tripDate: "17/06/2025",
  paymentSuccess: true,
  amount: "RS 7,500",
  details: {
    refNumber: "000085752257",
    paymentTime: "25-06-2025, 13:22:16",
    paymentMethod: "Bank Transfer",
    senderName: "S.K. Sathsara",
    amount: "RS 7,500.00/=",
    adminFee: "RS 30.00/=",
    paymentStatus: "Success",
  },
};

const UpcomingTripPayment = () => {
  return (
    <div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl min-h-[600px] flex flex-col items-center justify-center p-4 md:p-8">
        {/* Back Button */}
        <a href="/upcomingtripparticipants" className="mb-4 w-max">
          <button className="flex items-center bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg px-4 py-1 transition-colors duration-200 cursor-pointer text-sm shadow">
            <svg
              className="mr-2"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 19l-7-7 7-7"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
        </a>
        <div className="w-full max-w-md mx-auto bg-gray-100 rounded-2xl p-6 md:p-10 flex flex-col items-center">
          <div className="font-bold text-2xl md:text-2xl text-gray-800 mb-2 text-center">
            {paymentData.tripName}({paymentData.tripDate})
          </div>
          <div className="flex flex-col items-center mb-2">
            <span className="text-green-500 text-3xl mb-1">✔</span>
            <span className="text-green-500 font-semibold text-lg">
              Payment Success!
            </span>
          </div>
          <div className="font-bold text-3xl text-gray-800 mb-4">
            {paymentData.amount}
          </div>
          {/* Payment Details */}
          <div className="w-full bg-white rounded-xl shadow p-4 mb-6">
            <div className="font-semibold text-center text-gray-700 mb-3">
              Payment Details
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ref Number</span>
                <span className="font-semibold">{paymentData.details.refNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Time</span>
                <span className="font-semibold">{paymentData.details.paymentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-semibold">{paymentData.details.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sender Name</span>
                <span className="font-semibold">{paymentData.details.senderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">{paymentData.details.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Admin Fee</span>
                <span className="font-semibold">{paymentData.details.adminFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span>
                  <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs font-semibold">
                    {paymentData.details.paymentStatus}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* WhatsApp Invite */}
          <div className="w-full flex flex-col items-center mt-4">
            <div className="text-gray-400 text-lg mb-2 text-center">
              Click here to send a WhatsApp invite link
            </div>
            <button
              className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold rounded px-6 py-1 transition-colors duration-200 cursor-pointer"
              onClick={() => alert("WhatsApp invite link sent!")}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTripPayment;