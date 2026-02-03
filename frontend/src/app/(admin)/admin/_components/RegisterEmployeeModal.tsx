"use client";
import React, { useState } from "react";
import { X, UserPlus, Mail, Lock, User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";

interface RegisterEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/employees/register",
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
          setFormData({ name: "", email: "", password: "" });
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register employee");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Top Gradient Bar */}
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
              <UserPlus className="h-8 w-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Register Employee</h2>
            <p className="text-slate-400 text-sm mt-1">
              Add a new employee and send credentials via email
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center py-8 animate-in zoom-in duration-300">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Success!</h3>
              <p className="text-slate-400 text-center mt-2">
                Employee registered successfully. Credentials have been sent to their email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                  <p className="text-rose-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
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

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
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

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Initial Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Register Employee</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
