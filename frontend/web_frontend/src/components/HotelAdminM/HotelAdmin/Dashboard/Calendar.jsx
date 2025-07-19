import React from 'react';
import { format } from 'date-fns';

const Calendar = ({ calendarDate, setCalendarDate, today }) => {
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

      <div className="grid grid-cols-7 gap-1 text-sm text-gray-500 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={`day-${index}`} className="text-center">
            {day.charAt(0)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 min-h-[252px]">
        {days.map((date, idx) => (
          <div
            key={idx}
            className={`aspect-square flex items-center justify-center text-sm rounded-full cursor-pointer
            ${
              date.isCurrentMonth
                ? date.day === today.getDate() &&
                  calendarDate.getMonth() === today.getMonth() &&
                  calendarDate.getFullYear() === today.getFullYear()
                  ? 'bg-yellow-300 text-black font-semibold'
                  : 'hover:bg-gray-100 text-gray-800'
                : 'text-gray-400'
            }`}
          >
            {date.day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
