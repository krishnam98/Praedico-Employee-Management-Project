"use client";
import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  Trash2,
  FileText,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
  Edit
} from "lucide-react";
import axios from "axios";
import CreateTaskModal from "../_components/CreateTaskModal";
import ViewSubmissionsModal from "../_components/ViewSubmissionsModal";
import UpdateTaskModal from "../_components/UpdateTaskModal";
import ViewTaskDetailsModal from "../_components/ViewTaskDetailsModal";

// --- Custom Select Component (Reused) ---
function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  icon: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 py-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-2xl overflow-hidden">
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => { onChange("all"); setIsOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all hover:bg-indigo-500/10 ${value === "all" ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-slate-100'}`}
            >
              <span>{placeholder}</span>
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all hover:bg-indigo-500/10 ${value === opt ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-slate-100'}`}
              >
                <span className="truncate">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface Task {
  _id: string;
  taskId: string;
  title: string;
  description: string;
  status: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    employeeId: string;
  };
  assignedBy: {
    _id: string;
    name: string;
  };
  deadline: string;
  createdAt: string;
  submittedAt?: string;
  isInProgress?: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/tasks/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
    setActiveMenu(null);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTasks(prev => prev.filter(t => t._id !== taskId));
      setActiveMenu(null);
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleViewSubmissions = (task: Task) => {
    setSelectedTask(task);
    setIsSubmissionsModalOpen(true);
    setActiveMenu(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="h-10 w-10 text-indigo-500" />
            Task Management
          </h1>
          <p className="text-slate-400 mt-2 font-medium">
            Assign, track, and manage employee tasks
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          Create Task
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Tasks</p>
          <h3 className="text-3xl font-black text-white">{tasks.length}</h3>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">In Progress</p>
          <h3 className="text-3xl font-black text-amber-400">{tasks.filter(t => t.status === "Work In Progress").length}</h3>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Completed</p>
          <h3 className="text-3xl font-black text-emerald-400">{tasks.filter(t => t.status === "Completed").length}</h3>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Created</p>
          <h3 className="text-3xl font-black text-slate-400">{tasks.filter(t => t.status === "Created").length}</h3>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-800/20 p-4 rounded-3xl border border-slate-700/30">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, ID, or employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all">
              <FileText className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={["Created", "Pending", "Work In Progress", "Completed", "Overdue"]}
            placeholder="All Status"
            icon={Filter}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Tasks...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
            <p className="text-white font-bold">{error}</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 bg-slate-700/30 rounded-full flex items-center justify-center mb-6">
              <CheckSquare className="h-10 w-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Tasks Found</h3>
            <p className="text-slate-500">Create a task to get started.</p>
          </div>
        ) : (
          <div className="overflow-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md shadow-sm">
                <tr className="border-b border-slate-700/50">
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap min-w-[200px]">Task ID</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap min-w-[300px]">Title</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Assigned To</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Assigned By</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">Deadline</th>
                  <th className="py-5 px-6 text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => handleViewTask(task)}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="py-6 px-6">
                      <code className="text-xs bg-indigo-500/10 px-3 py-1.5 rounded-lg text-indigo-400 font-bold border border-indigo-500/20">
                        {task.taskId}
                      </code>
                    </td>
                    <td className="py-6 px-6">
                      <p className="text-white font-bold text-sm">{task.title}</p>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg ring-2 ring-white/5 group-hover:scale-110 transition-transform shrink-0">
                          {task.assignedTo?.name ? task.assignedTo.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div className="min-w-[150px]">
                          <p className="text-white font-bold text-sm leading-none mb-1 group-hover:text-indigo-400 transition-colors truncate">
                            {task.assignedTo?.name || "Unassigned"}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium truncate">
                            <span className="text-xs">{task.assignedTo?.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="text-slate-300 font-bold text-sm">{task.assignedBy?.name || "Admin"}</span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        {/* Permanent Overdue Badge (Red) */}
                        {task.deadline && new Date() > new Date(task.deadline) && task.status !== "Completed" && (
                          <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap shadow-[0_0_10px_rgba(244,63,94,0.15)]">
                            Overdue
                          </span>
                        )}

                        {/* Dynamic Status Badge (Case-based) */}
                        {task.status === "Submitted" ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                            Submitted
                          </span>
                        ) : (task.isInProgress || task.status === "Work In Progress") ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap animate-pulse">
                            In Progress
                          </span>
                        ) : task.status === "Completed" ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                            Completed
                          </span>
                        ) : (task.status === "Pending" && (!task.deadline || new Date() <= new Date(task.deadline))) ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-700/50 text-slate-400 border border-slate-600 whitespace-nowrap">
                            Pending
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Deadline"}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenu(activeMenu === task._id ? null : task._id)}
                          className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-all focus:ring-2 focus:ring-indigo-500/50"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {activeMenu === task._id && (
                          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-2 space-y-1">
                              <button
                                onClick={() => handleEdit(task)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-400 hover:bg-indigo-500/10 transition-all"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Task
                              </button>
                              <button
                                onClick={() => handleViewSubmissions(task)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-700/50 transition-all"
                              >
                                <FileText className="h-4 w-4" />
                                View Submissions
                              </button>
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Task
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
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchTasks}
      />

      <UpdateTaskModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedTask(null);
        }}
        onSuccess={fetchTasks}
        task={selectedTask}
      />

      <ViewSubmissionsModal
        isOpen={isSubmissionsModalOpen}
        onClose={() => {
          setIsSubmissionsModalOpen(false);
          setSelectedTask(null);
        }}
        taskId={selectedTask?._id || null}
        taskTitle={selectedTask?.title || ""}
      />

      <ViewTaskDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

    </div>
  );
}
