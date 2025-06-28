import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const participants = [
	{ name: "S.K. Sathsara" },
	{ name: "Ashan Kavinda" },
	{ name: "Bimsara" },
	{ name: "Sudewa" },
];

// SVG user icon for the yellow circle
const userIcon = (
	<svg width="22" height="22" fill="none" viewBox="0 0 24 24">
		<circle cx="12" cy="8" r="4" fill="#fff" />
		<rect x="5" y="15" width="14" height="5" rx="2.5" fill="#fff" />
	</svg>
);

const UpcomingTripParticipants = () => {
	return (
		<div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center">
			<div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl min-h-[600px] p-4 md:p-8 gap-6">
				{/* Main Content */}
				<div className="flex-[2] flex flex-col">
					{/* Back Button */}
					<a href="/upcomingtripdetails" className="mb-4 w-max">
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
					<div className="font-semibold text-xl md:text-2xl mb-1 mt-2">
						Kandy Trip
					</div>
					<div className="text-gray-500 text-sm mb-6">17 June, 2025</div>
					<div className="font-bold text-lg mb-4">All New Participants</div>
					{/* Participants List */}
					<div className="flex flex-col gap-4 mb-6">
						{participants.map((item, idx) => (
							<div
								key={item.name}
								className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4"
							>
								<span className="w-7 h-7 md:w-9 md:h-9 rounded-full inline-flex items-center justify-center bg-yellow-300 mr-4">
									{userIcon}
								</span>
								<span className="font-medium text-base md:text-lg flex-1">
									{item.name}
								</span>
								<a
									href="/upcomingtrippayment"
									className="w-full md:w-auto"
								>
									<span className="text-gray-500 text-sm font-medium cursor-pointer hover:underline">
										view details →
									</span>
								</a>
							</div>
						))}
					</div>
				</div>
				{/* Right Sidebar */}
				<div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col items-center">
					<div className="font-bold text-xl mb-4 w-full text-center">
						Kandy Trips
					</div>
					{/* MUI Calendar */}
					<div className="bg-gray-100 rounded-xl p-4 w-full mb-8 flex flex-col items-center">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateCalendar />
						</LocalizationProvider>
					</div>
					{/* Filled Slots */}
					<div className="bg-gray-100 rounded-xl p-6 w-full flex flex-col items-center">
						<img
							src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
							alt="notif"
							className="w-12 mb-3"
						/>
						<div className="text-gray-500 font-bold text-lg mb-2">
							Filled Slots :
						</div>
						<div className="font-bold text-3xl mb-3">20</div>
						<button className="bg-gray-900 text-white rounded-lg px-6 py-1 font-semibold hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
							VIEW WhatsApp GROUP
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UpcomingTripParticipants;


