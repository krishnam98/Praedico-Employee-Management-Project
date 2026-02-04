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
  UserCheck,
  ChevronDown,
  Check,
  UserX,
  Power,
  Trash2
} from "lucide-react";
import axios from "axios";
import RegisterEmployeeModal from "../_components/RegisterEmployeeModal";

// --- Custom Premium Select Component ---
function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon
}: {
  value: string;
  onChange: (val: string) => void;
  options: (string | undefined)[];
  placeholder: string;
  icon: any;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = value === "all" ? placeholder : value;

  return (
    <div className="relative group w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-11 pr-4 py-3.5 bg-slate-800/40 border ${isOpen ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-slate-700/30'} rounded-2xl text-slate-200 text-sm font-bold transition-all hover:bg-slate-800/60 shadow-lg`}
      >
        <div className="flex items-center gap-2 overflow-hidden text-left">
          <Icon className={`absolute left-4 h-4 w-4 ${isOpen ? 'text-indigo-400' : 'text-indigo-500/50'} transition-colors`} />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 py-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-2xl overflow-hidden">
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => { onChange("all"); setIsOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all hover:bg-indigo-500/10 ${value === "all" ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-slate-100'}`}
            >
              <span>{placeholder}</span>
              {value === "all" && <Check className="h-4 w-4 text-indigo-500" />}
            </button>
            {options.map((opt) => opt && (
              <button
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all hover:bg-indigo-500/10 ${value === opt ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-slate-100'}`}
              >
                <span className="truncate">{opt}</span>
                {value === opt && <Check className="h-4 w-4 text-indigo-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface Employee {
  _id: string;
  employeeId?: string;
  name: string;
  email: string;
  role: string;
  designation?: string;
  category?: string;
  employeeType?: string;
  temporaryType?: string;
  phoneNumber?: string;
  reportingManager?: string;
  isActive: boolean;
  createdAt: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.patch(
        `http://localhost:5000/api/admin/employees/${id}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setEmployees(prev => prev.map(emp =>
          emp._id === id ? { ...emp, isActive: !currentStatus } : emp
        ));
        setActiveMenu(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setEmployees(prev => prev.filter(emp => emp._id !== id));
        setActiveMenu(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete employee");
    }
  };

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

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDesignation = designationFilter === "all" || emp.designation === designationFilter;
    const matchesCategory = categoryFilter === "all" || emp.category === categoryFilter;
    const matchesType = typeFilter === "all" || emp.employeeType === typeFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? emp.isActive : !emp.isActive);

    return matchesSearch && matchesDesignation && matchesCategory && matchesType && matchesStatus;
  });

  // Get unique values for filters
  const designations = Array.from(new Set(employees.map(e => e.designation).filter(Boolean)));
  const categories = Array.from(new Set(employees.map(e => e.category).filter(Boolean)));
  const types = Array.from(new Set(employees.map(e => e.employeeType).filter(Boolean)));

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
          <h3 className="text-3xl font-black text-emerald-400">{employees.filter(e => e.isActive).length}</h3>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Newly Joined</p>
          <h3 className="text-3xl font-black text-indigo-400">0</h3>
        </div>
      </div>

      {/* Filtering & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-800/20 p-4 rounded-3xl border border-slate-700/30">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all">
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomSelect
            value={designationFilter}
            onChange={setDesignationFilter}
            options={designations}
            placeholder="All Designations"
            icon={Filter}
          />
          <CustomSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categories}
            placeholder="All Departments"
            icon={ShieldAlert}
          />
          <CustomSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={types}
            placeholder="All Types"
            icon={Calendar}
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={["active", "deactivated"]}
            placeholder="All Status"
            icon={ShieldAlert}
          />
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
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Status</th>
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
                        title={employee.employeeId || employee._id}
                        className="text-xs bg-indigo-500/10 px-3 py-1.5 rounded-lg text-indigo-400 font-bold border border-indigo-500/20 cursor-default hover:bg-indigo-500/20 transition-all"
                      >
                        {employee.employeeId || `${employee._id.slice(0, 6).toUpperCase()}...`}
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
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${employee.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${employee.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {employee.isActive ? 'Active' : 'Deactivated'}
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
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setActiveMenu(activeMenu === employee._id ? null : employee._id)}
                          className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-all focus:ring-2 focus:ring-indigo-500/50"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {activeMenu === employee._id && (
                          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl overflow-hidden">
                            <div className="p-2 border-b border-slate-800">
                              <p className="px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee Actions</p>
                            </div>
                            <div className="p-2 space-y-1">
                              <button
                                onClick={() => handleToggleStatus(employee._id, employee.isActive)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${employee.isActive
                                    ? 'text-rose-400 hover:bg-rose-500/10'
                                    : 'text-emerald-400 hover:bg-emerald-500/10'
                                  }`}
                              >
                                {employee.isActive ? (
                                  <>
                                    <UserX className="h-4 w-4" />
                                    Deactivate Account
                                  </>
                                ) : (
                                  <>
                                    <Power className="h-4 w-4" />
                                    Activate Account
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleDelete(employee._id)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Employee
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
