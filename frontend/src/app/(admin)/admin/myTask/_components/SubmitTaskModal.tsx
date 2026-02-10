"use client";

import { useState, useEffect } from "react";
import { X, Send, Paperclip, CheckCircle2, AlertCircle, Upload, Link as LinkIcon, FileText } from "lucide-react";

interface SubmitTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: { _id: string; title: string; status: string };
    onSuccess: () => void;
}

export default function SubmitTaskModal({ isOpen, onClose, task, onSuccess }: SubmitTaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [attachmentType, setAttachmentType] = useState<"link" | "file">("link");
    const [attachmentLink, setAttachmentLink] = useState("");
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [submissionId, setSubmissionId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_FILE_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
    ];

    // Fetch existing submission if task is already submitted
    useEffect(() => {
        if (isOpen && (task.status === "Submitted" || task.status === "Rejected")) {
            fetchExistingSubmission();
        } else if (isOpen) {
            // Reset form for new submission
            setTitle("");
            setDescription("");
            setAttachmentLink("");
            setAttachmentFile(null);
            setIsEditMode(false);
            setSubmissionId(null);
        }
    }, [isOpen, task]);

    const fetchExistingSubmission = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tasks/submissions/${task._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await response.json();

            if (data.success && data.data) {
                setTitle(data.data.title);
                setDescription(data.data.description);
                setAttachmentLink(data.data.attachment || "");
                setSubmissionId(data.data._id);
                setIsEditMode(true);
            }
        } catch (err) {
            console.error("Error fetching submission:", err);
        }
    };

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            setError("File size must be less than 10MB");
            return;
        }

        // Check file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setError("Only PDF, Word, PowerPoint, and text files are allowed");
            return;
        }

        setError("");
        setAttachmentFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("admin_token");
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            if (attachmentType === "file" && attachmentFile) {
                formData.append("attachment", attachmentFile);
            } else if (attachmentType === "link" && attachmentLink) {
                formData.append("attachment", attachmentLink);
            }

            let response;

            if (isEditMode && submissionId) {
                // Update existing submission
                response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tasks/submissions/${submissionId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
            } else {
                // Create new submission
                formData.append("taskId", task._id);
                response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/tasks/submit`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                });
            }

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    // Reset form
                    setTitle("");
                    setDescription("");
                    setAttachmentLink("");
                    setAttachmentFile(null);
                    setSuccess(false);
                    setIsEditMode(false);
                    setSubmissionId(null);
                }, 2000);
            } else {
                setError(data.message || `Failed to ${isEditMode ? 'update' : 'submit'} task`);
            }
        } catch (err) {
            console.error("Error submitting task:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {isEditMode ? "Edit Task Submission" : "Submit Task Report"}
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Task: <span className="text-indigo-400 font-medium">{task.title}</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {success ? (
                        <div className="py-10 text-center space-y-4">
                            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                {isEditMode ? "Updated Successfully!" : "Submitted Successfully!"}
                            </h3>
                            <p className="text-slate-400">Your task report has been {isEditMode ? "updated" : "recorded"}.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                    <AlertCircle size={20} />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 uppercase tracking-widest pl-1">Submission Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    placeholder="Brief title for your submission"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 uppercase tracking-widest pl-1">Description / Report</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                                    placeholder="Describe your progress and findings..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-400 uppercase tracking-widest pl-1">Attachment (Optional)</label>

                                {/* Toggle between Link and File */}
                                <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl border border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => setAttachmentType("link")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${attachmentType === "link"
                                            ? "bg-indigo-600 text-white shadow-lg"
                                            : "text-slate-400 hover:text-white"
                                            }`}
                                    >
                                        <LinkIcon size={16} />
                                        Link
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAttachmentType("file")}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${attachmentType === "file"
                                            ? "bg-indigo-600 text-white shadow-lg"
                                            : "text-slate-400 hover:text-white"
                                            }`}
                                    >
                                        <Upload size={16} />
                                        Upload File
                                    </button>
                                </div>

                                {/* Link Input */}
                                {attachmentType === "link" && (
                                    <div className="relative">
                                        <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="url"
                                            value={attachmentLink}
                                            onChange={(e) => setAttachmentLink(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="https://drive.google.com/file/..."
                                        />
                                    </div>
                                )}

                                {/* File Upload */}
                                {attachmentType === "file" && (
                                    <div className="space-y-2">
                                        <label className="block">
                                            <div className="relative cursor-pointer group">
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                                    className="hidden"
                                                />
                                                <div className="flex items-center gap-3 p-4 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl hover:border-indigo-500/50 transition-all">
                                                    <Upload className="text-slate-500 group-hover:text-indigo-500" size={24} />
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">
                                                            {attachmentFile ? attachmentFile.name : "Click to upload file"}
                                                        </p>
                                                        <p className="text-slate-500 text-xs mt-1">
                                                            PDF, Word, PowerPoint (Max 10MB)
                                                        </p>
                                                    </div>
                                                    {attachmentFile && (
                                                        <FileText className="text-indigo-500" size={24} />
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                        {attachmentFile && (
                                            <div className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="text-indigo-400" size={16} />
                                                    <span className="text-sm text-indigo-400 font-medium">{attachmentFile.name}</span>
                                                    <span className="text-xs text-slate-500">
                                                        ({(attachmentFile.size / 1024 / 1024).toFixed(2)} MB)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setAttachmentFile(null)}
                                                    className="text-slate-400 hover:text-red-400 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            {isEditMode ? "Update Submission" : "Submit Report"}
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
