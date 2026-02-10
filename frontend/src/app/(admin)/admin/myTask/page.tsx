"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Clock, CheckCircle2, FileText, Send, Paperclip } from "lucide-react";
import SubmitTaskModal from "./_components/SubmitTaskModal";

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    taskId: string;
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
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleOpenModal = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
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

            <div className="grid grid-cols-1 gap-6">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task._id} className="rounded-2xl bg-[#0f172a] p-6 border border-slate-800 shadow-lg hover:border-slate-700 transition-all group">
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
                                            {task.status === "Submitted" ? (
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
                                            <Clock size={16} />
                                            <span>Assigned: {new Date(task.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        {task.taskStarted && (
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <Clock size={16} />
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
                                                <span>Submitted: {new Date(task.submittedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {task.attachment && (
                                            <div className="flex flex-col gap-1 pt-2">
                                                <a
                                                    href={
                                                        (() => {
                                                            const url = task.attachment.startsWith("http")
                                                                ? task.attachment
                                                                : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/${task.attachment}`;

                                                            // Use Google Docs Viewer for all documents (including PDFs) to ensure compatibility
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
                                                <p className="text-[9px] text-slate-500 italic ml-1">
                                                    Documents open in Viewer. Images open directly.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end">
                                    {task.status === "Submitted" ? (
                                        <button
                                            onClick={() => handleOpenModal(task)}
                                            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <FileText size={18} />
                                            Edit Submission
                                        </button>
                                    ) : task.status === "Completed" ? (
                                        <button
                                            disabled
                                            className="px-6 py-3 bg-slate-700 text-slate-500 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={18} />
                                            Completed
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {(task.status === "Pending" || task.status === "Created" || task.status === "Overdue" || task.status === "Rejected") && (
                                                <button
                                                    onClick={() => handleUpdateStatus(task._id, "In Progress")}
                                                    className="px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Clock size={18} />
                                                    Set In Progress
                                                </button>
                                            )}

                                            {(task.status === "In Progress" || task.isInProgress) && (
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(task)}
                                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
                                                    >
                                                        <FileText size={18} />
                                                        {task.submittedAt ? "Edit Submission" : (new Date() > new Date(task.deadline || "") ? "Submit Overdue" : "Submit Task")}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(task._id, "Submitted")}
                                                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                                                    >
                                                        <Send size={18} />
                                                        Mark as Submitted
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 rounded-3xl bg-slate-800/20 border border-dashed border-slate-700">
                        <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No tasks assigned yet</h3>
                        <p className="text-slate-500 mt-1">Check back later for new assignments</p>
                    </div>
                )}
            </div>

            {selectedTask && (
                <SubmitTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={selectedTask}
                    onSuccess={fetchTasks}
                />
            )}
        </div>
    );
}
