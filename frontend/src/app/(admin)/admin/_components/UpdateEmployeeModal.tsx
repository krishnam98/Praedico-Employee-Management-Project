"use client";
import React, { useState, useEffect } from "react";
import { X, UserCog, Mail, User, Loader2, CheckCircle2, AlertCircle, Briefcase, Phone, Layers, UserCheck } from "lucide-react";
import axios from "axios";
import EmployeeSelector from "./EmployeeSelector";

interface UpdateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee | null;
}

interface Employee {
  _id: string;
  employeeId?: string;
  name: string;
  email: string;
  designation?: string;
  category?: string;
  employeeType?: string;
  temporaryType?: string;
  phoneNumber?: string;
  reportingManager?: string;
  isSeniorEmployee?: boolean;
}

interface Manager {
  _id: string;
  name: string;
  employeeId: string;
  designation: string;
}

export default function UpdateEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  employee,
}: UpdateEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    category: "",
    employeeType: "Regular",
    temporaryType: "",
    phoneNumber: "",
    reportingManager: "",
    isSeniorEmployee: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [managerSearch, setManagerSearch] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);

  // Populate form when employee data changes
  useEffect(() => {
    if (employee && isOpen) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        designation: employee.designation || "",
        category: employee.category || "",
        employeeType: employee.employeeType || "Regular",
        temporaryType: employee.temporaryType || "",
        phoneNumber: employee.phoneNumber || "",
        reportingManager: (employee.reportingManager as any)?._id || employee.reportingManager || "",
        isSeniorEmployee: employee.isSeniorEmployee || false,
      });
      
      // Initialize manager search text if reporting manager is populated
      if (employee.reportingManager) {
          const mgr = employee.reportingManager as any;
          if (mgr.name) {
              setManagerSearch(`${mgr.name} (${mgr.designation || ""})`);
          }
      } else {
          setManagerSearch("");
      }
      
      fetchManagers();
    }
  }, [employee, isOpen]);

  const fetchManagers = async () => {
    setLoadingManagers(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/managers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      if (response.data.success) {
        setManagers(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch managers:", err);
    } finally {
      setLoadingManagers(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/employees/${employee._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shrink-0" />

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-30"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0 shadow-lg shadow-indigo-500/5">
              <UserCog className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Update Employee</h2>
              <p className="text-slate-400 text-sm font-medium mt-0.5">
                Editing: <span className="text-indigo-400 font-bold">{employee.name}</span> <span className="text-slate-500 text-xs ml-2">({employee.employeeId || employee._id})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">


          {success ? (
            <div className="flex flex-col items-center py-8 animate-in zoom-in duration-300">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Success!</h3>
              <p className="text-slate-400 text-center mt-2">
                Employee information updated successfully
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                  <p className="text-rose-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Designation */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="" disabled className="bg-slate-900">Select Designation</option>
                      {[
                        "CEO", "CTO", "COO", "Director", "General Manager",
                        "Project Manager", "Product Manager", "Team Lead",
                        "Junior Developer", "Senior Developer", "Engineering Manager"
                      ].map(role => (
                        <option key={role} value={role} className="bg-slate-900">{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category/Department */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category / Department</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="" disabled className="bg-slate-900">Select Category</option>
                      {[
                        "Engineering / IT", "Human Resources (HR)", "Finance & Accounts",
                        "Sales", "Marketing", "Operations", "Customer Support",
                        "Administration", "Legal", "Product", "Research & Development (R&D)"
                      ].map(cat => (
                        <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Employee Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Employee Type</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <select
                      name="employeeType"
                      value={formData.employeeType}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="Regular" className="bg-slate-900">Regular</option>
                      <option value="Temporary" className="bg-slate-900">Temporary</option>
                    </select>
                  </div>
                </div>

                {/* Temporary Type (Conditional) */}
                {formData.employeeType === "Temporary" && (
                  <div className="space-y-2 animate-in slide-in-from-left-2">
                    <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest ml-1">Temporary Category</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                      <select
                        name="temporaryType"
                        value={formData.temporaryType}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                      >
                        <option value="" disabled className="bg-slate-900">Select Type</option>
                        <option value="Intern" className="bg-slate-900">Intern</option>
                        <option value="Employee" className="bg-slate-900">Employee</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Reporting Manager Selection */}
                <div className="md:col-span-2">
                    <EmployeeSelector
                        label="Reporting Manager"
                        value={formData.reportingManager}
                        onChange={(val) => setFormData({ ...formData, reportingManager: val })}
                        placeholder="Select a manager"
                        multiSelect={false}
                    />
                </div>

                {/* Senior Employee Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senior Status</label>
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, isSeniorEmployee: !prev.isSeniorEmployee }))}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.isSeniorEmployee 
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <UserCheck className={`h-5 w-5 ${formData.isSeniorEmployee ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="text-sm font-bold">Senior Employee</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.isSeniorEmployee ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isSeniorEmployee ? 'left-5' : 'left-1'}`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <UserCog className="h-5 w-5" />
                      <span>Update Employee</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
