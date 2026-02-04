"use client";

import { useState } from "react";
import { Sidebar } from "../../(admin)/admin/_components/Sidebar";
import DashboardNavbar from "../../(admin)/admin/_components/DashboardNavbar";

export default function EmployeeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("sidebarOpen");
            return saved !== null ? saved === "true" : true;
        }
        return true;
    });

    const handleSidebarToggle = () => {
        const newState = !isSidebarOpen;
        setSidebarOpen(newState);
        localStorage.setItem("sidebarOpen", String(newState));
    };

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                role="user"
                isOpen={isSidebarOpen}
                onToggle={handleSidebarToggle}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <DashboardNavbar />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
