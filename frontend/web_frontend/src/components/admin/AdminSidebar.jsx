import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import profile1 from "../../assets/profile1.jpeg"; // <-- Add this import

const sidebarLinks = [
  { label: "Admin Dashboard", to: "/admin" },
  { label: "Hotel Dashboard", to: "/system-admin/dashboard" },
  { label: "Vehicle Dashboard", to: "/allvehiclerequests" },
  { label: "Guide Dashboard", to: "/allguiderequests" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen py-8 px-6 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <img
            src={profile1} // <-- Use the imported image
            alt="profile"
            className="w-16 h-16 rounded-full"
          />
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 font-bold">4</span>
        </div>
        <div className="font-bold text-lg">Tharusha</div>
        <div className="text-gray-400 text-sm">tharusha@gmail.com</div>
      </div>
      <nav className="flex flex-col gap-4">
        {sidebarLinks.map((link, idx) => (
          <NavLink
            key={link.label + idx}
            to={link.to}
            className={({ isActive }) =>
              `text-lg font-semibold cursor-pointer transition-colors duration-200 rounded px-2 py-1
              ${
                isActive
                  ? "text-yellow-300 bg-gray-800"
                  : "text-white hover:bg-gray-800 hover:text-yellow-200"
              }`
            }
            end={link.to === "/admin"}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;