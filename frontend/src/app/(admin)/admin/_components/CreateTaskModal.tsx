"use client";
import React, { useState, useEffect } from "react";
import { X, CheckSquare, Calendar, User, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import axios from "axios";
import EmployeeSelector from "./EmployeeSelector";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  email: string;
  designation?: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: [] as string[],
    deadline: "",
    startDate: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      // Backend expects assignedTo as a JSON string when using FormData or multiple fields
      data.append("assignedTo", JSON.stringify(formData.assignedTo));
      data.append("deadline", formData.deadline);
      data.append("startDate", formData.startDate);
      if (attachment) {
        data.append("attachment", attachment);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/tasks/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            "Content-Type": "multipart/form-data",
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
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setFormData({
      title: "",
      description: "",
      assignedTo: [],
      deadline: "",
      startDate: "",
    });
    setAttachment(null);
    setEmployeeSearch("");
    setShowEmployeeDropdown(false);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
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
              <CheckSquare className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Create New Task</h2>
              <p className="text-slate-400 text-sm font-medium mt-0.5">
                Assign a new task to an employee
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
                Task created successfully.
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
                {/* Assign To Selection */}
                <EmployeeSelector
                  label="Assign To"
                  value={formData.assignedTo}
                  onChange={(val) => setFormData({ ...formData, assignedTo: val })}
                  placeholder="Select employee(s)"
                  multiSelect={true}
                />

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

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        type="date"
                        name="startDate"
                        required
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>

                  {/* Attachment */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Attachment (File)</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        type="file"
                        name="attachment"
                        onChange={handleFileChange}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {attachment && (
                  <p className="text-xs text-emerald-400 ml-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Selected: {attachment.name}
                  </p>
                )}
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
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-5 w-5" />
                      <span>Create Task</span>
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
