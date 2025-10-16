import React from 'react';
import { format } from 'date-fns';

const Calendar = ({ 
  calendarDate, 
  setCalendarDate, 
  today, 
  getCalendarDayStatus, 
  handleCalendarDayClick,
  availabilityLoading 
}) => {
  // Calendar helpers
  const selectedMonthYear = format(calendarDate, 'MMMM yyyy');
  const daysInMonth = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayIndex = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    1
  ).getDay();
  const prevMonthDays = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    0
  ).getDate();

  const days = [];

  // Previous month trailing days
  for (let i = firstDayIndex; i > 0; i--) {
    days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }
  // Fill 6 weeks (42 cells)
  while (days.length < 42) {
    days.push({
      day: days.length - daysInMonth - firstDayIndex + 1,
      isCurrentMonth: false,
    });
  }

  const handlePrevMonth = () =>
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const handleNextMonth = () =>
    setCalendarDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  // Get day style based on availability status
  const getDayStyle = (day, isCurrentMonth) => {
    if (!getCalendarDayStatus) {
      // Fallback to original styling if no status function provided
      return isCurrentMonth
        ? day === today.getDate() &&
          calendarDate.getMonth() === today.getMonth() &&
          calendarDate.getFullYear() === today.getFullYear()
          ? 'bg-yellow-300 text-black font-semibold'
          : 'hover:bg-gray-100 text-gray-800'
        : 'text-gray-400';
    }

    const status = getCalendarDayStatus(day, isCurrentMonth);
    
    switch (status) {
      case 'today':
        return 'bg-blue-500 text-white font-semibold hover:bg-blue-600';
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300';
      case 'unavailable':
        return 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300';
      case 'booked':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300';
      case 'past-unavailable':
        return 'bg-gray-200 text-gray-600 cursor-not-allowed opacity-60';
      case 'past-booked':
        return 'bg-gray-300 text-gray-700 cursor-default opacity-80 border border-gray-400';
      case 'other-month':
        return 'text-gray-400 hover:bg-gray-50';
      default:
        return 'hover:bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{selectedMonthYear}</h3>
        <div className="flex">
          <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-200">
            <span className="material-icons">chevron_left</span>
          </button>
          <button onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-200">
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Availability legend */}
      {getCalendarDayStatus && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-700 mb-2">Hotel Availability</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Has Bookings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span>Past Dates</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Click on future dates to manage availability
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-sm text-gray-500 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={`day-${index}`} className="text-center">
            {day.charAt(0)}
          </div>
        ))}
      </div>

      {availabilityLoading ? (
        <div className="min-h-[252px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 min-h-[252px]">
          {days.map((date, idx) => {
            const status = getCalendarDayStatus ? getCalendarDayStatus(date.day, date.isCurrentMonth) : null;
            const isPastDate = status === 'past-unavailable' || status === 'past-booked';
            const isClickable = date.isCurrentMonth && !isPastDate;
            
            return (
              <div
                key={idx}
                className={`aspect-square flex items-center justify-center text-sm rounded-md transition-colors duration-200 ${getDayStyle(date.day, date.isCurrentMonth)} ${isClickable ? 'cursor-pointer' : ''}`}
                onClick={() => isClickable && handleCalendarDayClick && handleCalendarDayClick(date.day, date.isCurrentMonth)}
                title={
                  isPastDate 
                    ? `${date.day} - Past date (cannot modify)` 
                    : isClickable && getCalendarDayStatus 
                      ? `Click to manage availability for ${date.day}` 
                      : ''
                }
              >
                {date.day}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
