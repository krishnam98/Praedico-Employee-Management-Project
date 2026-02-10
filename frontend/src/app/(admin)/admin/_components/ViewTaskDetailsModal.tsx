"use client";
import React from "react";
import { X, CheckSquare, Calendar, User, Clock, FileText, CheckCircle2, AlertCircle, Hash, Briefcase } from "lucide-react";

interface ViewTaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any | null; // using any temporarily to avoid strict type duplication, but ideally match Task interface
}

export default function ViewTaskDetailsModal({
    isOpen,
    onClose,
    task,
}: ViewTaskDetailsModalProps) {
    if (!isOpen || !task) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const statusColors = {
        "Completed": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        "Work In Progress": "text-amber-400 bg-amber-500/10 border-amber-500/20",
        "In Progress": "text-amber-400 bg-amber-500/10 border-amber-500/20",
        "Overdue": "text-rose-400 bg-rose-500/10 border-rose-500/20",
        "Created": "text-slate-400 bg-slate-700/50 border-slate-600",
        "Submitted": "text-blue-400 bg-blue-500/10 border-blue-500/20",
        "Rejected": "text-rose-400 bg-rose-500/10 border-rose-500/20",
        "default": "text-slate-400 bg-slate-700/50 border-slate-600"
    };

    const statusStyle = statusColors[task.status as keyof typeof statusColors] || statusColors["default"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 pointer-events-none" />

                <div className="relative p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-1 right-1 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Header */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-start justify-between">
                            <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-xl">
                                <CheckSquare className="h-8 w-8 text-indigo-400" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Overdue Badge */}
                                {(() => {
                                    const isOverdue = task.deadline && (
                                        (task.status === "Completed" || task.status === "Submitted")
                                            ? (task.submittedAt && new Date(task.submittedAt) > new Date(task.deadline))
                                            : (new Date() > new Date(task.deadline))
                                    );
                                    return isOverdue ? (
                                        <span className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                                            Overdue
                                        </span>
                                    ) : null;
                                })()}

                                <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border ${statusStyle}`}>
                                    {task.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-black text-white leading-tight mb-2">{task.title}</h2>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold font-mono">
                                    <Hash className="h-3 w-3" />
                                    {task.taskId}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                    <Clock className="h-4 w-4" />
                                    Created {formatDate(task.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Description
                            </h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                                {task.description || "No description provided."}
                            </p>
                        </div>

                        {/* Rejection Reason */}
                        {task.status === "Rejected" && task.rejectionReason && (
                            <div className="bg-rose-500/5 rounded-2xl p-6 border border-rose-500/20 animate-in slide-in-from-left-4 duration-500">
                                <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" /> Rejection Reason
                                </h3>
                                <p className="text-slate-300 leading-relaxed italic font-medium">
                                    "{task.rejectionReason}"
                                </p>
                                <p className="text-rose-400/50 text-[10px] uppercase font-black tracking-tighter mt-4">
                                    Admin requested changes to this task
                                </p>
                            </div>
                        )}

                        {/* Attachment */}
                        {task.attachment && (
                            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Attachment
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <a
                                        href={
                                            (() => {
                                                const url = task.attachment;
                                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

                                                // Use Google Docs Viewer for ALL documents (including PDFs) to ensure compatibility
                                                if (!isImage) {
                                                    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
                                                }
                                                return url;
                                            })()
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300 underline font-medium flex items-center gap-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        View/Open Attachment
                                    </a>
                                    <p className="text-[10px] text-slate-500 italic">
                                        Documents will open in Viewer. Images will open directly.
                                    </p>
                                </div>
                            </div>
                        )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assigned To */}
                <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 md:col-span-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User className="h-4 w-4" /> Assigned Employees ({(task.assignedTo || []).length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(task.assignedTo || []).map((emp: any) => (
                        <div key={emp._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-sm">
                            {(emp.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                             <p className="text-white font-bold text-sm truncate">{emp.name || "Unknown"}</p>
                             <div className="flex items-center gap-2">
                               <p className="text-indigo-400 text-[10px] font-black uppercase tracking-tighter">{emp.employeeId || "N/A"}</p>
                               <span className="text-slate-600 px-1 font-black">·</span>
                               <p className="text-slate-500 text-[10px] truncate max-w-[100px]">{emp.email}</p>
                             </div>
                          </div>
                        </div>
                      ))}
                      {(task.assignedTo || []).length === 0 && (
                        <p className="text-slate-500 italic text-sm">No employees assigned.</p>
                      )}
                    </div>
                </div>

                            {/* Assigned By */}
                            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> Assigned By
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg shadow-lg border border-indigo-500/30">
                                        {task.assignedBy?.name ? task.assignedBy.name.charAt(0).toUpperCase() : "A"}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">{task.assignedBy?.name || "Admin"}</p>
                                        <p className="text-slate-500 text-sm font-medium">Task Administrator</p>
                                    </div>
                                </div>
                            </div>

                            {/* Deadline */}
                            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Deadline Details
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <p className="text-white font-bold text-2xl">
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "No Deadline"}
                                    </p>
                                    {task.deadline && (
                                        <p className="text-slate-500 font-medium text-sm">
                                            {(() => {
                                                const deadline = new Date(task.deadline);

                                                const isCompletedOrSubmitted = task.status === "Completed" || task.status === "Submitted";
                                                const comparisonDate = isCompletedOrSubmitted && task.submittedAt ? new Date(task.submittedAt) : new Date();

                                                const diffTime = deadline.getTime() - comparisonDate.getTime();
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                if (diffDays < 0) {
                                                    return (
                                                        <span className="text-rose-400 font-bold">
                                                            {isCompletedOrSubmitted ? "Submitted late by" : "Overdue by"} {Math.abs(diffDays)} days
                                                        </span>
                                                    );
                                                }
                                                if (diffDays === 0) return <span className="text-amber-400 font-bold">Due Today</span>;
                                                return <span className="text-emerald-400">{diffDays} days remaining</span>;
                                            })()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Started Details */}
                            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> Start Status
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <p className="text-white font-bold text-2xl">
                                        {task.taskStarted ? new Date(task.taskStarted).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "Not Started"}
                                    </p>
                                    <p className="text-slate-500 font-medium text-sm">
                                        {task.taskStarted ? "Task work has been initiated" : "Pending employee action"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-700/50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-600"
                        >
                            Close Details
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
