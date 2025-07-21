import React from 'react';

const RecentBookings = ({ bookings }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Bookings</h3>
        <button className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center">
          View All
          <span className="material-icons text-sm ml-1">arrow_forward</span>
        </button>
      </div>

      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            {['Guest Name', 'Room Type', 'Check In', 'Check Out', 'Status'].map((th) => (
              <th
                key={th}
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {bookings.map((b) => (
            <tr key={b.name}>
              <td className="py-3 px-4">{b.name}</td>
              <td className="py-3 px-4">{b.room}</td>
              <td className="py-3 px-4">{b.in}</td>
              <td className="py-3 px-4">{b.out}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                    b.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBookings;
