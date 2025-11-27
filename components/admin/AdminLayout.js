// components/admin/AdminLayout.js
import React from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children, title }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {title && (
          <h1 className="text-2xl font-semibold mb-4">
            {title}
          </h1>
        )}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
