"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Calendar, 
  MoreVertical, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Phone,
  UserCheck
} from "lucide-react";
import axios from "axios";
import RegisterEmployeeModal from "../_components/RegisterEmployeeModal";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  designation?: string;
  category?: string;
  employeeType?: string;
  temporaryType?: string;
  phoneNumber?: string;
  reportingManager?: string;
  createdAt: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get("http://localhost:5000/api/admin/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="h-10 w-10 text-indigo-500" />
            Employee Management
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Register, manage and monitor your team members
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
        >
          <UserPlus className="h-5 w-5" />
          Add New Employee
        </button>
      </div>

      {/* Stats Quick View (Mockup for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Employees</p>
          <h3 className="text-3xl font-black text-white">{employees.length}</h3>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Active Now</p>
          <h3 className="text-3xl font-black text-emerald-400">{employees.length}</h3>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Newly Joined</p>
          <h3 className="text-3xl font-black text-indigo-400">0</h3>
        </div>
      </div>

      {/* Filtering & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-800/20 p-4 rounded-3xl border border-slate-700/30">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all">
            <Filter className="h-5 w-5" />
            Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Employees...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="h-16 w-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20">
              <ShieldAlert className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Error Fetching Data</h3>
            <p className="text-slate-400 max-w-sm">{error}</p>
            <button 
              onClick={fetchEmployees}
              className="mt-6 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 bg-slate-700/30 rounded-full flex items-center justify-center mb-6">
              <Users className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Employees Found</h3>
            <p className="text-slate-500 max-w-xs">
              {searchQuery ? `No results for "${searchQuery}"` : "Get started by adding your first employee."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700/50">
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Employee ID</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Employee</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap min-w-[120px]">Designation</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap min-w-[220px]">Department</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Type</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Contact</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap min-w-[200px]">Manager</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-6 px-6">
                      <code 
                        title={employee._id}
                        className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono cursor-default hover:text-indigo-400 transition-colors"
                      >
                        {employee._id.slice(0, 6).toUpperCase()}...
                      </code>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-white/5 group-hover:scale-110 transition-transform shrink-0">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-[150px]">
                          <p className="text-white font-bold text-sm leading-none mb-1 group-hover:text-indigo-400 transition-colors truncate">
                            {employee.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium truncate">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 min-w-[120px]">
                      <span className="text-slate-300 font-semibold text-xs whitespace-nowrap">
                        {employee.designation || "Not Set"}
                      </span>
                    </td>
                    <td className="py-6 px-6 min-w-[220px]">
                      <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                        {employee.category || "General"}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[11px] font-bold ${employee.employeeType === 'Temporary' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {employee.employeeType || "Regular"}
                        </span>
                        {employee.temporaryType && (
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded w-fit italic">
                            {employee.temporaryType}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        {employee.phoneNumber || "N/A"}
                      </div>
                    </td>
                    <td className="py-6 px-6 min-w-[200px]">
                      <div className="flex items-center gap-2 text-slate-300 font-medium text-xs">
                        <UserCheck className="h-3.5 w-3.5 text-indigo-500/50" />
                        {employee.reportingManager || "Owner"}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <button className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-all">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination */}
        {!loading && filteredEmployees.length > 0 && (
          <div className="p-6 border-t border-slate-700/50 flex items-center justify-between bg-slate-900/30">
            <p className="text-slate-500 text-sm font-medium">
              Showing <span className="text-white font-bold">{filteredEmployees.length}</span> employees
            </p>
            <div className="flex items-center gap-2">
              <button disabled className="p-2 rounded-lg bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <RegisterEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmployees}
      />
    </div>
  );
}
