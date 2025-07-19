import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

// Add SVG icons for each type
const icons = {
	hotel: (
		<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
			<rect x="4" y="8" width="16" height="10" rx="2" fill="#fff" />
			<rect x="7" y="11" width="2" height="2" rx="1" fill="#3B82F6" />
			<rect x="11" y="11" width="2" height="2" rx="1" fill="#3B82F6" />
			<rect x="15" y="11" width="2" height="2" rx="1" fill="#3B82F6" />
			<rect x="7" y="15" width="2" height="2" rx="1" fill="#3B82F6" />
			<rect x="11" y="15" width="2" height="2" rx="1" fill="#3B82F6" />
			<rect x="15" y="15" width="2" height="2" rx="1" fill="#3B82F6" />
			<rect x="9" y="4" width="6" height="4" rx="1" fill="#fff" />
		</svg>
	),
	vehicle: (
		<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
			<rect x="3" y="13" width="18" height="5" rx="2" fill="#fff" />
			<rect x="5" y="10" width="14" height="4" rx="1" fill="#fff" />
			<circle cx="7" cy="19" r="2" fill="#a78bfa" />
			<circle cx="17" cy="19" r="2" fill="#a78bfa" />
		</svg>
	),
	guide: (
		<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
			<circle cx="12" cy="9" r="4" fill="#fff" />
			<rect x="6" y="15" width="12" height="5" rx="2.5" fill="#fff" />
			<rect x="10" y="13" width="4" height="2" rx="1" fill="#fde047" />
		</svg>
	),
	merchant: (
		<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
			<rect x="4" y="8" width="16" height="10" rx="2" fill="#fff" />
			<rect x="8" y="12" width="8" height="2" rx="1" fill="#f87171" />
			<rect x="8" y="16" width="8" height="2" rx="1" fill="#f87171" />
			<rect x="10" y="4" width="4" height="4" rx="1" fill="#fff" />
		</svg>
	),
};

const legend = [
	{ color: "bg-blue-400", label: "Hotel Requests", count: 4, icon: icons.hotel },
	{ color: "bg-purple-400", label: "Vehicle Requests", count: 4, icon: icons.vehicle },
	{ color: "bg-yellow-400", label: "Guide's Requests", count: 4, icon: icons.guide },
	{ color: "bg-red-400", label: "Merchant Requests", count: 4, icon: icons.merchant },
];

const DashboardPage = () => {
	const today = new Date();
	const formattedDate = today.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center">
			<div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl min-h-[600px] p-4 md:p-8 gap-6">
				{/* Main Content */}
				<div className="flex-1 pr-0 lg:pr-8 flex flex-col">
					<div className="font-bold text-2xl mb-2">
						Number of Upcoming Trip : 5
					</div>
					<div className="text-gray-500 text-sm mb-6">{formattedDate}</div>
					{/* Legend Cards */}
					<div className="flex flex-col gap-4">
						{legend.map((item) => (
							<div
								key={item.label}
								className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4"
							>
								<span
									className={`w-10 h-10 md:w-12 md:h-12 rounded-full inline-flex items-center justify-center ${item.color} mr-4 md:mr-6`}
								>
									{item.icon}
								</span>
								<span className="font-bold text-base md:text-lg flex-1 text-center">
									{item.label}
								</span>
								<span className="font-bold text-lg md:text-xl">
									{item.count}
								</span>
							</div>
						))}
					</div>
					{/* System Cards */}
					
				</div>
				{/* Right Sidebar */}
				<div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col items-center">
					<div className="font-bold text-xl mb-4">Upcoming Trips</div>
					{/* MUI Calendar */}
					<div className="bg-gray-100 rounded-xl p-4 w-full mb-8 flex flex-col items-center">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateCalendar />
						</LocalizationProvider>
					</div>
					{/* Notifications */}
					<div className="bg-gray-100 rounded-xl p-6 w-full flex flex-col items-center">
						<img
							src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
							alt="notif"
							className="w-12 mb-3"
						/>
						<div className="text-red-500 font-bold text-lg mb-2">
							Unread Notifications
						</div>
						<div className="font-bold text-3xl mb-3">16</div>
						<button className="bg-gray-900 text-white rounded-lg px-6 py-1 font-semibold hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
							VIEW NOTIFICATION
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;


