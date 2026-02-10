"use client";
import React, { useState, useEffect } from "react";
import { X, CheckSquare, Calendar, User, Loader2, CheckCircle2, AlertCircle, FileText, Layers } from "lucide-react";
import axios from "axios";

interface UpdateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Task | null;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: {
    _id: string;
    name: string;
    employeeId: string;
    designation?: string;
  };
  deadline: string;
  status: string;
}

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  designation?: string;
}

export default function UpdateTaskModal({
  isOpen,
  onClose,
  onSuccess,
  task,
}: UpdateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    status: "",
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (task && isOpen) {
        // Format deadline date for input (YYYY-MM-DD)
        let formattedDeadline = "";
        if (task.deadline) {
            const date = new Date(task.deadline);
            formattedDeadline = date.toISOString().split('T')[0];
        }

        setFormData({
            title: task.title || "",
            description: task.description || "",
            assignedTo: task.assignedTo._id || "",
            deadline: formattedDeadline,
            status: task.status || "Created",
        });

        if (task.assignedTo) {
            setEmployeeSearch(`${task.assignedTo.name} (${task.assignedTo.designation || 'No Designation'})`);
        } else {
            setEmployeeSearch("");
        }
    }
  }, [task, isOpen]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/employees`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/tasks/${task._id}`,
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
            handleClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setEmployeeSearch("");
    setShowEmployeeDropdown(false);
    onSuccess();
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
              <CheckSquare className="h-8 w-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Update Task</h2>
            <p className="text-slate-400 text-sm mt-1">
              Modify task details
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center py-8 animate-in zoom-in duration-300">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Success!</h3>
              <p className="text-slate-400 text-center mt-2">
                Task updated successfully.
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

              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                  <div className="relative">
                    <CheckSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Monthly Report"
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
                    <textarea
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter task details..."
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assign To - Searchable */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assign To</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        type="text"
                        placeholder={loadingEmployees ? "Loading..." : "Search by name or designation..."}
                        value={employeeSearch}
                        onFocus={() => setShowEmployeeDropdown(true)}
                        onChange={(e) => {
                          setEmployeeSearch(e.target.value);
                          setShowEmployeeDropdown(true);
                          if (formData.assignedTo) {
                            setFormData({ ...formData, assignedTo: "" });
                          }
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />

                      {employeeSearch && (
                        <button 
                          type="button"
                          onClick={() => {
                            setEmployeeSearch("");
                            setFormData({ ...formData, assignedTo: "" });
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {showEmployeeDropdown && !loadingEmployees && (
                      <div className="absolute z-[110] left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2">
                        {employees
                          .filter(emp => 
                            emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) || 
                            (emp.designation && emp.designation.toLowerCase().includes(employeeSearch.toLowerCase()))
                          )
                          .length > 0 ? (
                          employees
                            .filter(emp => 
                              emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) || 
                              (emp.designation && emp.designation.toLowerCase().includes(employeeSearch.toLowerCase()))
                            )
                            .map((emp) => (
                              <button
                                key={emp._id}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, assignedTo: emp._id });
                                  setEmployeeSearch(`${emp.name} (${emp.designation || 'No Designation'})`);
                                  setShowEmployeeDropdown(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex flex-col border-b border-slate-700/50 last:border-0"
                              >
                                <span className="text-white font-bold text-sm">{emp.name}</span>
                                <span className="text-indigo-400 text-[10px] uppercase font-bold tracking-wider">{emp.designation || 'No Designation'}</span>
                              </button>
                            ))
                        ) : (
                          <div className="px-4 py-3 text-slate-400 text-sm italic">
                            No employees found matching "{employeeSearch}"
                          </div>
                        )}
                      </div>
                    )}
                    {showEmployeeDropdown && (
                      <div 
                        className="fixed inset-0 z-[105]" 
                        onClick={() => setShowEmployeeDropdown(false)}
                      />
                    )}
                  </div>

                  {/* Deadline */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        type="date"
                        name="deadline"
                        required
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                      >
                         <option value="Created" className="bg-slate-900">Created</option>
                         <option value="Pending" className="bg-slate-900">Pending</option>
                         <option value="In Progress" className="bg-slate-900">In Progress</option>
                         <option value="Submitted" className="bg-slate-900">Submitted</option>
                         <option value="Completed" className="bg-slate-900">Completed</option>
                         <option value="Rejected" className="bg-slate-900">Rejected</option>
                      </select>
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
                      <CheckSquare className="h-5 w-5" />
                      <span>Update Task</span>
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
