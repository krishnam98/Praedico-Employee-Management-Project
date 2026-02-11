"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Clock, CheckCircle2, FileText, Send, Paperclip, MoreVertical, Eye, Play, CheckSquare, Edit3, RefreshCw, Calendar } from "lucide-react";
import SubmitTaskModal from "./_components/SubmitTaskModal";
import ViewTaskDetailsModal from "../_components/ViewTaskDetailsModal";

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    taskId: string;
    startDate?: string;
    deadline?: string;
    createdAt: string;
    attachment?: string;
    submittedAt?: string;
    isInProgress?: boolean;
    taskStarted?: string;
    rejectionReason?: string;
}

export default function MyTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tasks/my-tasks`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setTasks(data.data);
            } else {
                setError(data.message || "Failed to load tasks");
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError("Error loading tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenSubmitModal = (task: Task) => {
        setSelectedTask(task);
        setIsSubmitModalOpen(true);
        setActiveMenu(null);
    };

    const handleOpenViewModal = (task: Task) => {
        setSelectedTask(task);
        setIsViewModalOpen(true);
        setActiveMenu(null);
    };

    const handleUpdateStatus = async (taskId: string, status: string) => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tasks/status/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            if (data.success) {
                fetchTasks();
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Error updating status");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700 pb-10">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 p-10 border border-slate-700 shadow-2xl">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">My Tasks</h1>
                <p className="text-slate-400 mt-2 text-lg">Manage and submit your daily reports</p>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Tasks</p>
                    <h3 className="text-3xl font-black text-white">{tasks.length}</h3>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">In Progress</p>
                    <h3 className="text-3xl font-black text-amber-400">{tasks.filter(t => t.status === "In Progress" || t.isInProgress).length}</h3>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Completed</p>
                    <h3 className="text-3xl font-black text-emerald-400">{tasks.filter(t => t.status === "Completed").length}</h3>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Submitted</p>
                    <h3 className="text-3xl font-black text-blue-400">{tasks.filter(t => t.status === "Submitted").length}</h3>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Pending</p>
                    <h3 className="text-3xl font-black text-slate-400">{tasks.filter(t => t.status === "Pending" || t.status === "Created" || t.status === "Rejected").length}</h3>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {/* Tasks Sections */}
            <div className="space-y-12">
                {/* Upcoming Tasks Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-amber-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-white tracking-tight">Upcoming Tasks</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {tasks.filter(t => t.startDate && new Date(t.startDate) > new Date()).length > 0 ? (
                            tasks.filter(t => t.startDate && new Date(t.startDate) > new Date()).map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onOpenSubmitModal={handleOpenSubmitModal}
                                    onOpenViewModal={handleOpenViewModal}
                                    onUpdateStatus={handleUpdateStatus}
                                    isUpcoming={true}
                                    activeMenu={activeMenu}
                                    setActiveMenu={setActiveMenu}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 rounded-3xl bg-slate-800/10 border border-dashed border-slate-700/50">
                                <p className="text-slate-500 font-medium">No upcoming tasks scheduled</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Tasks Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-indigo-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-white tracking-tight">Active Tasks</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {tasks.filter(t => !t.startDate || new Date(t.startDate) <= new Date()).length > 0 ? (
                            tasks.filter(t => !t.startDate || new Date(t.startDate) <= new Date()).map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onOpenSubmitModal={handleOpenSubmitModal}
                                    onOpenViewModal={handleOpenViewModal}
                                    onUpdateStatus={handleUpdateStatus}
                                    isUpcoming={false}
                                    activeMenu={activeMenu}
                                    setActiveMenu={setActiveMenu}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 rounded-3xl bg-slate-800/10 border border-dashed border-slate-700/50">
                                <p className="text-slate-500 font-medium">No active tasks at the moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedTask && (
                <SubmitTaskModal
                    isOpen={isSubmitModalOpen}
                    onClose={() => setIsSubmitModalOpen(false)}
                    task={selectedTask}
                    onSuccess={fetchTasks}
                />
            )}

            {selectedTask && (
                <ViewTaskDetailsModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    task={selectedTask}
                    showAssigned={false}
                />
            )}
        </div>
    );
}

// Sub-component for Task Card to keep the main page clean
function TaskCard({
    task,
    onOpenSubmitModal,
    onOpenViewModal,
    onUpdateStatus,
    isUpcoming,
    activeMenu,
    setActiveMenu
}: {
    task: Task;
    onOpenSubmitModal: (task: Task) => void;
    onOpenViewModal: (task: Task) => void;
    onUpdateStatus: (id: string, status: string) => void;
    isUpcoming: boolean;
    activeMenu: string | null;
    setActiveMenu: (id: string | null) => void;
}) {
    return (
        <div className={`rounded-2xl bg-[#0f172a] p-6 border border-slate-800 shadow-lg group transition-all ${isUpcoming ? 'opacity-75 grayscale-[0.5]' : 'hover:border-slate-700'}`}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{task.title}</h3>
                                {task.isInProgress && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30 animate-pulse">
                                        <Clock size={10} className="animate-spin-slow" />
                                        In Progress
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Task ID: {task.taskId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Overdue Badge */}
                            {(() => {
                                const isOverdue = task.deadline && (
                                    (task.status === "Completed" || task.status === "Submitted")
                                        ? (task.submittedAt && new Date(task.submittedAt) > new Date(task.deadline))
                                        : (new Date() > new Date(task.deadline))
                                );
                                return isOverdue ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                        Overdue
                                    </span>
                                ) : null;
                            })()}

                            {/* Dynamic Status Badge */}
                            {isUpcoming ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                    Scheduled
                                </span>
                            ) : task.status === "Submitted" ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    Submitted
                                </span>
                            ) : (task.isInProgress || task.status === "In Progress") ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                                    In Progress
                                </span>
                            ) : (task.status === "Pending" || task.status === "Created") ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                    {task.status === "Created" ? "Created" : "Pending"}
                                </span>
                            ) : task.status === "Completed" ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Completed
                                </span>
                            ) : task.status === "Rejected" ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    Rejected
                                </span>
                            ) : null}
                        </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{task.description}</p>

                    {task.status === "Rejected" && task.rejectionReason && (
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex gap-4 items-start animate-in slide-in-from-left-4 duration-500">
                            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
                                <AlertCircle className="text-rose-400" size={20} />
                            </div>
                            <div>
                                <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">Rejection Reason</p>
                                <p className="text-slate-300 text-sm italic font-medium">"{task.rejectionReason}"</p>
                                <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-tighter">Please address these issues and resubmit the task.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Clock size={16} className="text-slate-500" />
                            <span>Assigned: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>

                        {task.startDate && (
                            <div className={`flex items-center gap-2 text-sm ${isUpcoming ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                                <Calendar size={16} className={isUpcoming ? 'text-amber-500' : 'text-slate-500'} />
                                <span>Starts: {new Date(task.startDate).toLocaleDateString()}</span>
                            </div>
                        )}

                        {task.taskStarted && (
                            <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium">
                                <Clock size={16} className="text-indigo-500" />
                                <span>Started: {new Date(task.taskStarted).toLocaleDateString()}</span>
                            </div>
                        )}
                        {task.deadline && (
                            <div className={`flex items-center gap-2 text-sm ${new Date() > new Date(task.deadline) && task.status !== "Completed" && task.status !== "Submitted" ? "text-red-400 animate-pulse" : "text-orange-400"}`}>
                                <Clock size={16} />
                                <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                        )}
                        {task.submittedAt && (
                            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                <CheckCircle2 size={16} />
                                <span>Recent Submit: {new Date(task.submittedAt).toLocaleDateString()}</span>
                            </div>
                        )}
                        {task.attachment && (
                            <div className="flex flex-col gap-1 pt-2">
                                <a
                                    href={
                                        (() => {
                                            const url = task.attachment?.startsWith("http")
                                                ? task.attachment
                                                : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/${task.attachment}`;

                                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                                            if (!isImage) {
                                                return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
                                            }
                                            return url;
                                        })()
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-2 rounded-lg border border-indigo-500/20 transition-all hover:bg-indigo-500/20"
                                >
                                    <Paperclip size={14} />
                                    View Task Attachment
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</p>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setActiveMenu(activeMenu === task._id ? null : task._id)}
                            className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700/50"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {activeMenu === task._id && (
                            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2 space-y-1">
                                    {/* View Task - Always available */}
                                    <button
                                        onClick={() => onOpenViewModal(task)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-all text-left"
                                    >
                                        <Eye size={16} className="text-indigo-400" />
                                        View Task
                                    </button>

                                    {/* Initial States: Set In Progress */}
                                    {(task.status === "Pending" || task.status === "Created" || task.status === "Rejected") && (
                                        <button
                                            onClick={() => onUpdateStatus(task._id, "In Progress")}
                                            disabled={isUpcoming}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${isUpcoming ? 'text-slate-600 cursor-not-allowed' : 'text-amber-400 hover:bg-amber-500/10'}`}
                                        >
                                            <Play size={16} />
                                            {isUpcoming ? 'Starts ' + new Date(task.startDate!).toLocaleDateString() : 'Set In Progress'}
                                        </button>
                                    )}

                                    {/* In Progress States: Submit & Mark Submitted */}
                                    {(task.status === "In Progress" || task.isInProgress) && (
                                        <>
                                            {!task.submittedAt ? (
                                                <button
                                                    onClick={() => onOpenSubmitModal(task)}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-400 hover:bg-indigo-500/10 transition-all text-left"
                                                >
                                                    <FileText size={16} />
                                                    Submit Report
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => onOpenSubmitModal(task)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-400 hover:bg-amber-500/10 transition-all text-left"
                                                    >
                                                        <Edit3 size={16} />
                                                        Edit Last Submit
                                                    </button>
                                                    <button
                                                        onClick={() => onOpenSubmitModal(task)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-blue-400 hover:bg-blue-500/10 transition-all text-left"
                                                    >
                                                        <RefreshCw size={16} />
                                                        Update Task
                                                    </button>
                                                    <button
                                                        onClick={() => onUpdateStatus(task._id, "Submitted")}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all text-left border-t border-slate-800 mt-1 pt-2"
                                                    >
                                                        <CheckSquare size={16} />
                                                        Mark as Submitted
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}

                                    {/* Submitted State: Allow editing until approved */}
                                    {task.status === "Submitted" && (
                                        <>
                                            <button
                                                onClick={() => onOpenSubmitModal(task)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-400 hover:bg-amber-500/10 transition-all text-left"
                                            >
                                                <Edit3 size={16} />
                                                Edit Last Submit
                                            </button>
                                            <button
                                                onClick={() => onOpenSubmitModal(task)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-blue-400 hover:bg-blue-500/10 transition-all text-left"
                                            >
                                                <RefreshCw size={16} />
                                                Update Task
                                            </button>
                                        </>
                                    )}

                                    {/* Completed State */}
                                    {task.status === "Completed" && (
                                        <div className="px-3 py-2.5 text-sm font-bold text-emerald-500/50 flex items-center gap-3">
                                            <CheckCircle2 size={16} />
                                            Task Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

