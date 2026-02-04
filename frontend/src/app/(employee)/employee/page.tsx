"use client";

import { useState, useEffect } from "react";
import AuthCheck from "./_components/AuthCheck";
import { hasLimitedAccess, getEmployeeTypeDisplay, Employee } from "./_components/employeeData";
import { EmployeeProfileSummary } from "./shared-components/EmployeeProfileSummary";
import { EmployeeInfoCard } from "./shared-components/EmployeeInfoCard";
import {
    Lock,
    User,
    Briefcase,
    Building2,
    Calendar,
    Shield,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Award,
    TrendingUp,
    BarChart3
} from "lucide-react";

export default function EmployeeHomePage() {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const token = localStorage.getItem("employeeToken");
                if (!token) {
                    window.location.href = "/";
                    return;
                }

                const response = await fetch("http://localhost:5000/api/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.success) {
                    // Map backend data to Employee interface
                    const employeeData: Employee = {
                        id: data.data._id || "N/A",
                        name: data.data.name || "Unknown",
                        email: data.data.email || "",
                        avatar: "/avatars/employee-face.png",
                        category: data.data.category || "Engineering",
                        designation: data.data.designation || "Employee",
                        employeeType: data.data.employeeType || "Regular",
                        temporaryType: data.data.temporaryType || null,
                        joinDate: data.data.createdAt || new Date().toISOString(),
                        department: data.data.category || "General",
                        phone: data.data.phoneNumber || "N/A",
                        address: "N/A",
                        reportingManager: data.data.reportingManager || "Not Assigned"
                    };
                    setEmployee(employeeData);
                } else {
                    setError("Failed to load employee data");
                }
            } catch (err) {
                console.error("Error fetching employee data:", err);
                setError("Error loading employee data");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, []);

    if (loading) {
        return (
            <AuthCheck>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-slate-400 mt-4">Loading employee data...</p>
                    </div>
                </div>
            </AuthCheck>
        );
    }

    if (error || !employee) {
        return (
            <AuthCheck>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-400">{error || "Failed to load employee data"}</p>
                    </div>
                </div>
            </AuthCheck>
        );
    }

    const isLimitedAccess = hasLimitedAccess(employee);

    return (
        <AuthCheck>
            <div className="space-y-8 animate-in fade-in duration-700 pb-10 text-slate-200">

                {/* Hero Welcome Section */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-10 shadow-2xl shadow-indigo-900/50 ring-1 ring-white/10 group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl group-hover:bg-blue-400/40 transition-all duration-1000"></div>
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl group-hover:bg-purple-400/40 transition-all duration-1000"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md w-fit mb-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-medium text-white/90">Dashboard Active</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">{employee.name}</span>!
                            </h1>
                            <p className="text-indigo-100/80 max-w-xl text-lg font-light leading-relaxed">
                                You're logged in as <span className="font-bold text-white border-b border-white/30">{employee.designation}</span> in the {employee.department} department.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Limited Access Warning for Temporary Employees */}
                {isLimitedAccess && (
                    <div className="rounded-[2rem] bg-amber-500/10 border border-amber-500/20 p-6 flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-amber-400 mb-1">Limited Access Account</h3>
                            <p className="text-amber-200/80 text-sm">
                                As a {employee.temporaryType?.toLowerCase()} employee, you have restricted access to certain features and actions.
                            </p>
                        </div>
                    </div>
                )}

                {/* Quick Stats - Dashboard Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EmployeeInfoCard
                        title="Attendance Rate"
                        value="95%"
                        icon={CheckCircle2}
                        color="text-emerald-400"
                        bg="bg-emerald-500/10"
                        border="group-hover:border-emerald-500/50"
                        subtitle="This month"
                    />
                    <EmployeeInfoCard
                        title="Leave Balance"
                        value="12 Days"
                        icon={Calendar}
                        color="text-blue-400"
                        bg="bg-blue-500/10"
                        border="group-hover:border-blue-500/50"
                        subtitle="Available"
                    />
                    <EmployeeInfoCard
                        title="Pending Tasks"
                        value="8"
                        icon={Clock}
                        color="text-orange-400"
                        bg="bg-orange-500/10"
                        border="group-hover:border-orange-500/50"
                        subtitle="Due this week"
                    />
                    <EmployeeInfoCard
                        title="Performance"
                        value="Excellent"
                        icon={TrendingUp}
                        color="text-purple-400"
                        bg="bg-purple-500/10"
                        border="group-hover:border-purple-500/50"
                        subtitle="Last review"
                    />
                </div>

                {/* Profile Summary */}
                <EmployeeProfileSummary employee={employee} />

                {/* Employee Information Cards */}
                <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Employee Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <InfoCard
                            title="Employee ID"
                            value={employee.id}
                            icon={User}
                            color="text-blue-400"
                            bg="bg-blue-500/10"
                        />
                        <InfoCard
                            title="Category"
                            value={employee.category}
                            icon={Briefcase}
                            color="text-purple-400"
                            bg="bg-purple-500/10"
                        />
                        <InfoCard
                            title="Designation"
                            value={employee.designation}
                            icon={Building2}
                            color="text-emerald-400"
                            bg="bg-emerald-500/10"
                        />
                        <InfoCard
                            title="Employment Type"
                            value={getEmployeeTypeDisplay(employee)}
                            icon={Shield}
                            color={employee.employeeType === "Regular" ? "text-emerald-400" : "text-amber-400"}
                            bg={employee.employeeType === "Regular" ? "bg-emerald-500/10" : "bg-amber-500/10"}
                        />
                    </div>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Recent Activity */}
                    <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
                                <p className="text-slate-400 text-sm mt-1">Your latest actions</p>
                            </div>
                            <BarChart3 className="h-6 w-6 text-slate-500" />
                        </div>

                        <div className="space-y-4">
                            <ActivityItem
                                icon={CheckCircle2}
                                title="Attendance Marked"
                                time="Today, 9:00 AM"
                                color="text-emerald-400"
                                bg="bg-emerald-500/10"
                            />
                            <ActivityItem
                                icon={FileText}
                                title="Document Submitted"
                                time="Yesterday, 3:30 PM"
                                color="text-blue-400"
                                bg="bg-blue-500/10"
                            />
                            <ActivityItem
                                icon={Calendar}
                                title="Leave Request Approved"
                                time="2 days ago"
                                color="text-purple-400"
                                bg="bg-purple-500/10"
                            />
                            <ActivityItem
                                icon={Award}
                                title="Performance Review Completed"
                                time="1 week ago"
                                color="text-amber-400"
                                bg="bg-amber-500/10"
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Quick Actions</h3>
                                <p className="text-slate-400 text-sm mt-1">Common tasks</p>
                            </div>
                            <AlertCircle className="h-6 w-6 text-slate-500" />
                        </div>

                        <div className="space-y-3">
                            <QuickActionButton
                                icon={Calendar}
                                label="Request Leave"
                                description="Apply for time off"
                            />
                            <QuickActionButton
                                icon={FileText}
                                label="View Documents"
                                description="Access your files"
                            />
                            <QuickActionButton
                                icon={Clock}
                                label="Mark Attendance"
                                description="Check in/out"
                            />
                            <QuickActionButton
                                icon={Award}
                                label="View Performance"
                                description="See your reviews"
                            />
                        </div>
                    </div>
                </div>

                {/* Department Information */}
                <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Department Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InfoBox
                            label="Department"
                            value={employee.department}
                            color="text-blue-400"
                        />
                        <InfoBox
                            label="Join Date"
                            value={new Date(employee.joinDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            color="text-purple-400"
                        />
                        <InfoBox
                            label="Reporting Manager"
                            value={employee.reportingManager || "Not Assigned"}
                            color="text-emerald-400"
                        />
                    </div>
                </div>

                {/* Change Password Button */}
                <div className="flex justify-center">
                    <button
                        disabled={isLimitedAccess}
                        className={`group relative overflow-hidden px-8 py-6 rounded-2xl font-bold transition-all duration-300 ${isLimitedAccess
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                            : "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 hover:border-slate-600 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            }`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                            <Lock className="h-6 w-6" />
                            Change Password
                            {isLimitedAccess && <span className="text-xs font-normal">(Not Available)</span>}
                        </span>
                    </button>
                </div>


                {/* Footer Note */}
                <div className="text-center text-slate-500 text-sm">
                    <p>For any assistance, please contact HR at <span className="text-blue-400 font-medium">hr@praedico.com</span></p>
                </div>
            </div>
        </AuthCheck>
    );
}

// Helper Components
function InfoCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors group">
            <div className={`p-3 rounded-lg ${bg} ${color}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{title}</p>
                <p className="text-base text-white font-medium">{value}</p>
            </div>
        </div>
    );
}

function ActivityItem({ icon: Icon, title, time, color, bg }: any) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors group">
            <div className={`p-2.5 rounded-lg ${bg} ${color}`}>
                <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{time}</p>
            </div>
        </div>
    );
}

function QuickActionButton({ icon: Icon, label, description }: any) {
    return (
        <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-700/50 hover:border-blue-500/30 transition-all group text-left">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{label}</p>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
        </button>
    );
}

function InfoBox({ label, value, color }: any) {
    return (
        <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
    );
}
