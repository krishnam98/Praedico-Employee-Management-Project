"use client";
import { useState } from "react";
import { Sidebar } from "../_components/Sidebar";
import DashboardNavbar from "../_components/DashboardNavbar";
import UserManagementModal from "../_components/UserManagementModal";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar
        role="admin"
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
        onUserManagementClick={() => setIsUserManagementOpen(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
      />
    </div>
  );
}
