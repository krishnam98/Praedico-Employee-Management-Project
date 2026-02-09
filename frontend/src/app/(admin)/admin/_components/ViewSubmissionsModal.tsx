"use client";
import React, { useState, useEffect } from "react";
import { X, CheckSquare, Loader2, FileText, Check, Download, AlertCircle } from "lucide-react";
import axios from "axios";

interface ViewSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  taskTitle: string;
}

interface Submission {
  _id: string;
  employee: {
    _id: string;
    name: string;
    employeeId: string;
  };
  title: string;
  description: string;
  attachment?: string;
  submittedId: string;
  createdAt: string;
  task?: {
    deadline?: string;
  };
}

export default function ViewSubmissionsModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
}: ViewSubmissionsModalProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && taskId) {
      fetchSubmissions();
    }
  }, [isOpen, taskId]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/submissions/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      if (response.data.success) {
        setSubmissions(response.data.data);
      }
    } catch (err: any) {
      setError("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    setProcessing(submissionId);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/submissions/${submissionId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Submission approved and task marked as completed.");
        onClose();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (submissionId: string) => {
    if (!window.confirm("Are you sure you want to reject this submission? The task will be marked as Rejected.")) {
      return;
    }
    setProcessing(submissionId);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/submissions/${submissionId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Submission rejected. Employee can resubmit or view status.");
        onClose();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject");
    } finally {
      setProcessing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="h-6 w-6 text-emerald-400" />
              Submissions
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Viewing submissions for task: <span className="text-white font-semibold">{taskTitle}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-3" />
              <p className="text-slate-400 text-sm font-medium">Loading submissions...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
              <p className="text-white font-medium">No submissions found or error occurred.</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
              <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">No submissions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub._id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 transition-all hover:bg-slate-800/50">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{sub.title}</h3>
                        <span className="text-xs font-mono bg-slate-900 text-slate-400 px-2 py-1 rounded-md border border-slate-700">{sub.submittedId}</span>
                      </div>
                      <div className="text-sm text-slate-400 flex items-center gap-2">
                        <span className="text-indigo-400 font-semibold">{sub.employee.name}</span>
                        <span>•</span>
                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                        {sub.createdAt && sub.task?.deadline && new Date(sub.createdAt) > new Date(sub.task.deadline) && (
                          <span className="ml-2 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20 uppercase tracking-wider">
                            Overdue Submission
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                        {sub.description}
                      </p>
                      {sub.attachment && (
                        <a
                          href={sub.attachment.startsWith("http") ? sub.attachment : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/${sub.attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-3 bg-emerald-400/10 px-3 py-2 rounded-lg border border-emerald-400/20 transition-all hover:bg-emerald-400/20"
                        >
                          <Download className="h-3.5 w-3.5" />
                          {sub.attachment.includes("uploads/") ? "View/Download Document" : "Open Link"}
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(sub._id)}
                        disabled={processing === sub._id}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
                      >
                        {processing === sub._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(sub._id)}
                        disabled={processing === sub._id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                      >
                        {processing === sub._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
