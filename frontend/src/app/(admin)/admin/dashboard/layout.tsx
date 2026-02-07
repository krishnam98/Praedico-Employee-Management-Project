"use client";
import { useState } from "react";
import { Sidebar } from "../_components/Sidebar";
import DashboardNavbar from "../_components/DashboardNavbar";
import UserManagementModal from "../_components/UserManagementModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to manage sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        role="admin"
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
        onUserManagementClick={() => setIsUserManagementOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />
    </div>
  );
}
