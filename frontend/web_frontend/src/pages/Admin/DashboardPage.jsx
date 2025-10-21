import React, { useState, useEffect } from "react";
import axios from "axios";
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
	pending: (
		<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
			<rect x="4" y="4" width="16" height="16" rx="2" fill="#fff" />
			<path
				d="M9 12l2 2 4-4"
				stroke="#f59e0b"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
		</svg>
	),
	upcoming: (
		<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
			<rect x="4" y="4" width="16" height="16" rx="2" fill="#fff" />
			<path
				d="M8 10h8M8 14h8"
				stroke="#10b981"
				strokeWidth="2"
				strokeLinecap="round"
				fill="none"
			/>
			<circle cx="12" cy="6" r="1" fill="#10b981" />
		</svg>
	),
};

const DashboardPage = () => {
	const [dashboardData, setDashboardData] = useState({
		hotelQuotations: 0,
		vehicleQuotations: 0,
		guideQuotations: 0,
		pendingTrips: 0,
		upcomingTrips: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// API URLs based on your controllers
	const API_URLS = {
		hotelQuotations: "http://localhost:8080/api/quotations",
		vehicleQuotations: "http://localhost:8080/api/vehicle/groupTours", // This gives unsubmitted tours, we'll need to count differently
		guideQuotations: "http://localhost:8080/api/guide/groupTours", // Same as above
		pendingTrips: "http://localhost:8080/api/pendingTrip/getall",
		upcomingTrips: "http://localhost:8080/api/upcomingTrip/getall",
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		setLoading(true);
		setError("");

		try {
			console.log("=== FETCHING DASHBOARD DATA ===");

			// Fetch all data concurrently
			const [
				hotelResponse,
				pendingTripsResponse,
				upcomingTripsResponse,
			] = await Promise.allSettled([
				axios.get(API_URLS.hotelQuotations),
				axios.get(API_URLS.pendingTrips),
				axios.get(API_URLS.upcomingTrips),
			]);

			// Process hotel quotations
			let hotelCount = 0;
			if (hotelResponse.status === "fulfilled") {
				hotelCount = hotelResponse.value.data.length;
				console.log("Hotel quotations count:", hotelCount);
			} else {
				console.error("Failed to fetch hotel quotations:", hotelResponse.reason);
			}

			// Process pending trips
			let pendingTripsCount = 0;
			let pendingTripsData = [];
			if (pendingTripsResponse.status === "fulfilled") {
				pendingTripsData = pendingTripsResponse.value.data;
				pendingTripsCount = pendingTripsData.length;
				console.log("Pending trips count:", pendingTripsCount);
			} else {
				console.error("Failed to fetch pending trips:", pendingTripsResponse.reason);
			}

			// Process upcoming trips
			let upcomingTripsCount = 0;
			if (upcomingTripsResponse.status === "fulfilled") {
				upcomingTripsCount = upcomingTripsResponse.value.data.length;
				console.log("Upcoming trips count:", upcomingTripsCount);
			} else {
				console.error("Failed to fetch upcoming trips:", upcomingTripsResponse.reason);
			}

			// Now fetch quotations for each pending trip to get accurate counts
			let vehicleQuotationsCount = 0;
			let guideQuotationsCount = 0;

			if (pendingTripsData.length > 0) {
				console.log("Fetching quotations for", pendingTripsData.length, "pending trips");

				// Fetch all quotations for all trips
				const quotationPromises = pendingTripsData.map(async (trip) => {
					const tripId = trip.ptId;

					try {
						const [vehicleQuotationsRes, guideQuotationsRes] = await Promise.allSettled([
							axios.get(`http://localhost:8080/api/vehicle/trip/${tripId}`),
							axios.get(`http://localhost:8080/api/guide/trip/${tripId}`),
						]);

						let vehicleCount = 0;
						let guideCount = 0;

						if (vehicleQuotationsRes.status === "fulfilled") {
							vehicleCount = vehicleQuotationsRes.value.data.length;
						}

						if (guideQuotationsRes.status === "fulfilled") {
							guideCount = guideQuotationsRes.value.data.length;
						}

						return { vehicleCount, guideCount };
					} catch (error) {
						console.error(`Error fetching quotations for trip ${tripId}:`, error);
						return { vehicleCount: 0, guideCount: 0 };
					}
				});

				// Wait for all quotation requests to complete
				const quotationResults = await Promise.allSettled(quotationPromises);

				quotationResults.forEach((result, index) => {
					if (result.status === "fulfilled") {
						vehicleQuotationsCount += result.value.vehicleCount;
						guideQuotationsCount += result.value.guideCount;
					} else {
						console.error(`Failed to process quotations for trip ${index}:`, result.reason);
					}
				});
			}

			console.log("Vehicle quotations count:", vehicleQuotationsCount);
			console.log("Guide quotations count:", guideQuotationsCount);

			// Update state with all counts
			setDashboardData({
				hotelQuotations: hotelCount,
				vehicleQuotations: vehicleQuotationsCount,
				guideQuotations: guideQuotationsCount,
				pendingTrips: pendingTripsCount,
				upcomingTrips: upcomingTripsCount,
			});

			console.log("=== DASHBOARD DATA UPDATED ===");
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			setError("Failed to load dashboard data. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const today = new Date();
	const formattedDate = today.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});

	// Create legend array with real data
	const legend = [
		{
			color: "bg-blue-400",
			label: "Hotel Quotations",
			count: dashboardData.hotelQuotations,
			icon: icons.hotel,
			href: "/allhotelquotation",
		},
		{
			color: "bg-purple-400",
			label: "Vehicle Quotations",
			count: dashboardData.vehicleQuotations,
			icon: icons.vehicle,
			href: "/allvehiclequotation",
		},
		{
			color: "bg-yellow-400",
			label: "Guide Quotations",
			count: dashboardData.guideQuotations,
			icon: icons.guide,
			href: "/allguidequotation",
		},
		{
			color: "bg-orange-400",
			label: "Pending Trips",
			count: dashboardData.pendingTrips,
			icon: icons.pending,
			href: "/pendingtrips",
		},
		{
			color: "bg-green-400",
			label: "Upcoming Trips",
			count: dashboardData.upcomingTrips,
			icon: icons.upcoming,
			href: "/upcomingtrips",
		},
	];

	const handleCardClick = (href) => {
		if (href) {
			window.location.href = href;
		}
	};

	if (loading) {
		return (
			<div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center items-center">
				<div className="bg-white rounded-3xl shadow-lg p-8">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
					<p className="text-center mt-4 text-gray-600">Loading dashboard data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 bg-gray-100 min-h-screen py-4 px-2 flex justify-center">
			<div className="bg-white rounded-3xl shadow-lg flex flex-col lg:flex-row w-full max-w-6xl min-h-[600px] p-4 md:p-8 gap-6">
				{/* Main Content */}
				<div className="flex-1 pr-0 lg:pr-8 flex flex-col">
					<div className="font-bold text-2xl mb-2">Dashboard Overview</div>
					<div className="text-gray-500 text-sm mb-2">{formattedDate}</div>

					{/* Total Summary */}
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
							<div>
								<div className="text-2xl font-bold text-blue-600">
									{dashboardData.upcomingTrips}
								</div>
								<div className="text-sm text-gray-600">Upcoming Trips</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-orange-600">
									{dashboardData.pendingTrips}
								</div>
								<div className="text-sm text-gray-600">Pending Trips</div>
							</div>
							<div className="col-span-2 md:col-span-1">
								<div className="text-2xl font-bold text-green-600">
									{dashboardData.hotelQuotations + dashboardData.vehicleQuotations + dashboardData.guideQuotations}
								</div>
								<div className="text-sm text-gray-600">Total Quotations</div>
							</div>
						</div>
					</div>

					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							{error}
							<button
								onClick={fetchDashboardData}
								className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
							>
								Retry
							</button>
						</div>
					)}

					{/* Legend Cards */}
					<div className="flex flex-col gap-4">
						{legend.map((item) => (
							<div
								key={item.label}
								onClick={() => handleCardClick(item.href)}
								className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
							>
								<span
									className={`w-10 h-10 md:w-12 md:h-12 rounded-full inline-flex items-center justify-center ${item.color} mr-4 md:mr-6`}
								>
									{item.icon}
								</span>
								<span className="font-bold text-base md:text-lg flex-1">
									{item.label}
								</span>
								<div className="flex flex-col items-end">
									<span className="font-bold text-lg md:text-xl">
										{loading ? "..." : item.count}
									</span>
									{item.href && (
										<span className="text-xs text-gray-500">Click to view →</span>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Refresh Button */}
					<div className="mt-6">
						<button
							onClick={fetchDashboardData}
							disabled={loading}
							className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors duration-200"
						>
							{loading ? "Refreshing..." : "Refresh Data"}
						</button>
					</div>
				</div>

				{/* Right Sidebar */}
				<div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 lg:pl-8 flex flex-col items-center">
					<div className="font-bold text-xl mb-4">Calendar & Notifications</div>

					{/* MUI Calendar */}
					<div className="bg-gray-100 rounded-xl p-4 w-full mb-8 flex flex-col items-center">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateCalendar />
						</LocalizationProvider>
					</div>

					{/* Quick Stats */}
					<div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 w-full mb-6">
						<div className="text-center">
							<div className="text-sm text-gray-600 mb-2">System Status</div>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<div className="font-bold text-green-600">Active</div>
									<div className="text-xs text-gray-500">All Systems</div>
								</div>
								<div>
									<div className="font-bold text-blue-600">
										{new Date().toLocaleTimeString()}
									</div>
									<div className="text-xs text-gray-500">Last Updated</div>
								</div>
							</div>
						</div>
					</div>

					{/* Notifications */}
					<div className="bg-gray-100 rounded-xl p-6 w-full flex flex-col items-center">
						<img
							src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
							alt="notifications"
							className="w-12 mb-3"
						/>
						<div className="text-red-500 font-bold text-lg mb-2">
							Unread Notifications
						</div>
						<div className="font-bold text-3xl mb-3">16</div>
						<button className="bg-gray-900 text-white rounded-lg px-6 py-1 font-semibold hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
							VIEW NOTIFICATIONS
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;


