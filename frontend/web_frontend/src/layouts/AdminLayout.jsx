import React from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <AdminNavbar />
    <div className="flex flex-1">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  </div>
);

export default AdminLayout;