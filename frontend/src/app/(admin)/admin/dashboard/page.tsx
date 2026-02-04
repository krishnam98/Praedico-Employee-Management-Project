"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Activity, Clock, MoreVertical, DollarSign, ArrowUpRight, ArrowDownRight, Mail, MousePointer2, Eye, Calendar, MessageSquare, Paperclip, Search, Star, Filter, ChevronRight, PanelLeftClose, PanelLeft, LayoutDashboard, BarChart2, ShoppingCart, FileText, Inbox, Layers, Archive } from "lucide-react";
import axios from 'axios';
// import UserManagementModal from "../_components/UserManagementModal";


export default function AdminDashboard() {
  // 1. STATIC DATA
  const [stats] = useState({ 
    totalUsers: "12,345", 
    activeUsers: "854", 
    pendingVerifications: 12 
  });
  
  // 2. DYNAMIC NAME STATE
  const [adminName, setAdminName] = useState("Admin");
  const router = useRouter();
// const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);



  // 3. DECODE TOKEN FOR NAME
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          router.push("/admin/auth/signIn");
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (data.success && data.user) {
          setAdminName(data.user.name || "Admin");
        }
      } catch (e) {
        console.error("Failed to fetch admin profile", e);
        router.push("/admin/auth/signIn");
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 text-slate-200">
      
      {/* =====================================================================================
          SECTION 1: HERO & KEY METRICS (UNCHANGED)
      ===================================================================================== */}
      
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-10 shadow-2xl shadow-indigo-900/50 ring-1 ring-white/10 group">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl group-hover:bg-blue-400/40 transition-all duration-1000"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl group-hover:bg-purple-400/40 transition-all duration-1000"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md w-fit mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-white/90">System Operational</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">{adminName}</span>!
            </h1>
            <p className="text-indigo-100/80 max-w-xl text-lg font-light leading-relaxed">
              You have <span className="font-bold text-white border-b border-white/30">{stats.pendingVerifications} pending requests</span> requiring your attention today.
            </p>
          </div>
          <button className="group relative overflow-hidden bg-white text-indigo-900 px-8 py-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-[1.02] transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              View Reports <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* TOP METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DarkMetricCard 
          title="Total Income" value="$65.4K" sub="+12.5% vs last month" 
          icon={DollarSign} color="text-emerald-400" bg="bg-emerald-500/10" border="group-hover:border-emerald-500/50"
        />
        <DarkMetricCard 
          title="Total Users" value={stats.totalUsers} sub="+1.2% vs last month" 
          icon={Users} color="text-blue-400" bg="bg-blue-500/10" border="group-hover:border-blue-500/50"
        />
        <DarkMetricCard 
          title="Active Sessions" value={stats.activeUsers} sub="-2.4% vs last week" 
          icon={Activity} color="text-purple-400" bg="bg-purple-500/10" border="group-hover:border-purple-500/50"
        />
        <DarkMetricCard 
          title="Pending Items" value={stats.pendingVerifications} sub="Requires attention" 
          icon={Clock} color="text-orange-400" bg="bg-orange-500/10" border="group-hover:border-orange-500/50"
        />
      </div>

      {/* =====================================================================================
          SECTION 2: MAIN REVENUE & DEVICE CHARTS (UNCHANGED)
      ===================================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MONTHLY REVENUE */}
        <div className="lg:col-span-2 rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Monthly Revenue</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <p className="text-slate-400 text-sm">Revenue analytics for 2024</p>
              </div>
            </div>
            <button className="p-2.5 hover:bg-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-white ring-1 ring-transparent hover:ring-slate-600">
              <MoreVertical size={20} />
            </button>
          </div>
          
          <div className="relative h-64 w-full flex items-end justify-between gap-3 px-2 z-10">
            {[15, 45, 35, 55, 25, 18, 22, 38, 16, 42, 30, 50].map((h, i) => (
              <div key={i} className="w-full h-full flex items-end relative group/bar">
                <div 
                  className="w-full rounded-t-xl bg-gradient-to-t from-blue-600/20 to-blue-500/80 group-hover/bar:from-blue-500 group-hover/bar:to-cyan-400 transition-all duration-500 shadow-[0_0_0_1px_rgba(59,130,246,0.1)] group-hover/bar:shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover/bar:scale-y-105 origin-bottom relative overflow-hidden"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/50 shadow-[0_0_10px_white]"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-xs text-slate-500 font-bold uppercase tracking-widest relative z-10">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
              <span key={m} className="hover:text-blue-400 transition-colors cursor-default">{m}</span>
            ))}
          </div>
        </div>

        {/* DEVICE TYPE DONUT */}
        <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-1">Device Type</h3>
            <p className="text-slate-400 text-sm">Session distribution</p>
          </div>
          
          <div className="relative h-56 w-56 mx-auto my-6 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-xl group-hover:blur-2xl transition-all duration-700"></div>
            <div className="absolute inset-0 rounded-full border-[20px] border-slate-800/50 backdrop-blur-sm"></div>
            <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="url(#deviceGradient)" strokeWidth="20" strokeDasharray="210 251" strokeLinecap="round" className="transition-all duration-1000 ease-out group-hover:stroke-[22]" />
              <defs>
                <linearGradient id="deviceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">68%</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Mobile</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"/> 
                <div>
                  <p className="text-xs text-slate-400 font-medium">Desktop</p>
                  <p className="text-sm font-bold text-white">35%</p>
                </div>
             </div>
             <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"/> 
                <div>
                  <p className="text-xs text-slate-400 font-medium">Tablet</p>
                  <p className="text-sm font-bold text-white">48%</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* =====================================================================================
          SECTION 3: DETAILED ANALYTICS (UNCHANGED)
      ===================================================================================== */}
      <div className="flex items-center justify-between pt-6 px-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Detailed Analytics</h2>
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          View All <ArrowUpRight size={14} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* CARD 1: ACTIVE USERS (Gauge) */}
        <div className="rounded-[2rem] bg-[#0f172a] p-6 border border-slate-800 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-white tracking-tight">42.5K</h3>
              <p className="text-slate-400 text-xs font-medium">Active Users</p>
            </div>
            <MoreVertical size={20} className="text-slate-600 hover:text-white transition-colors" />
          </div>
          <div className="relative h-32 w-full flex items-center justify-center">
            <svg viewBox="0 0 100 50" className="w-48 overflow-visible drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
               <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
               <path d="M 10 50 A 40 40 0 0 1 75 25" fill="none" stroke="url(#orangeGradient)" strokeWidth="6" strokeLinecap="round" 
                     className="transition-all duration-1000 group-hover:stroke-[7]" />
               <defs>
                 <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#fbbf24" />
                   <stop offset="100%" stopColor="#ef4444" />
                 </linearGradient>
               </defs>
               <text x="50" y="42" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" className="tracking-tighter">78%</text>
            </svg>
          </div>
          <p className="text-center text-xs text-slate-400 font-medium mt-1">
            <span className="text-emerald-400 font-bold">+24K</span> users vs last month
          </p>
        </div>

        {/* CARD 2: TOTAL USERS (Green Line Chart) */}
        <div className="rounded-[2rem] bg-[#0f172a] p-6 border border-slate-800 shadow-lg group hover:-translate-y-1 transition-transform duration-500">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="text-3xl font-bold text-white tracking-tight">97.4K</h3>
              <p className="text-slate-400 text-xs font-medium">Total Users</p>
            </div>
            <MoreVertical size={20} className="text-slate-600 hover:text-white transition-colors" />
          </div>
          <div className="h-24 w-full mt-4 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]">
              <path d="M0 50 Q 30 40, 50 30 T 100 20 T 150 40 T 200 10" 
                    fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                    className="path-animate" />
            </svg>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold border border-emerald-500/20">+12.5%</span>
            <span className="text-slate-500 text-xs">Since last month</span>
          </div>
        </div>

        {/* CARD 3: TOTAL CLICKS (Pink Bar Chart) */}
        <div className="rounded-[2rem] bg-[#0f172a] p-6 border border-slate-800 shadow-lg group hover:-translate-y-1 transition-transform duration-500">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold text-white tracking-tight">82.7K</h3>
              <p className="text-slate-400 text-xs font-medium">Total Clicks</p>
            </div>
            <MoreVertical size={20} className="text-slate-600 hover:text-white transition-colors" />
          </div>
          <div className="h-24 w-full flex items-end justify-between gap-1.5 mt-2">
             {[10, 15, 8, 20, 25, 18, 30, 35, 22, 45, 60, 50].map((h, i) => (
                <div key={i} className="w-full bg-gradient-to-t from-pink-600 to-rose-400 rounded-full opacity-80 group-hover:opacity-100 transition-all duration-300" style={{ height: `${h}%` }} />
             ))}
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold border border-emerald-500/20">+12.5%</span>
            <span className="text-slate-500 text-xs">Since last month</span>
          </div>
        </div>

        {/* CARD 4: TOTAL VIEWS (Zig Zag Line) */}
        <div className="rounded-[2rem] bg-[#0f172a] p-6 border border-slate-800 shadow-lg group hover:-translate-y-1 transition-transform duration-500">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold text-white tracking-tight">68.4K</h3>
              <p className="text-slate-400 text-xs font-medium">Total Views</p>
            </div>
            <MoreVertical size={20} className="text-slate-600 hover:text-white transition-colors" />
          </div>
          <div className="h-24 w-full mt-4">
             <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                <polyline points="0,70 40,40 80,60 120,20 160,50 200,10" 
                          fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="0" cy="70" r="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                <circle cx="40" cy="40" r="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                <circle cx="80" cy="60" r="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                <circle cx="120" cy="20" r="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                <circle cx="160" cy="50" r="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                <circle cx="200" cy="10" r="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
             </svg>
          </div>
          <p className="text-slate-400 text-xs font-medium mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            35K new views today
          </p>
        </div>

        {/* CARD 5: TOTAL ACCOUNTS (Wide Area Chart) */}
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <div className="relative z-10 flex justify-between items-center mb-6">
             <div>
               <h3 className="text-4xl font-bold text-white tracking-tight">85,247</h3>
               <p className="text-slate-400 text-sm font-medium mt-1">Total Accounts Created</p>
             </div>
             <div className="bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-md">
               <span className="text-emerald-400 text-sm font-bold flex items-center gap-1.5">
                 <ArrowUpRight size={18} strokeWidth={3} /> 23.7% Growth
               </span>
             </div>
           </div>
           <div className="h-40 w-full mt-4 relative">
             <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                 </linearGradient>
               </defs>
               <path d="M0 100 L0 70 Q 50 40 100 70 T 200 50 T 300 20 T 400 60 L 400 100 Z" 
                     fill="url(#waveGradient)" 
                     className="transition-all duration-1000 ease-in-out group-hover:opacity-90" />
               <path d="M0 70 Q 50 40 100 70 T 200 50 T 300 20 T 400 60" 
                     fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" 
                     className="drop-shadow-[0_4px_10px_rgba(251,191,36,0.4)]" />
             </svg>
           </div>
        </div>
      </div>

      {/* =====================================================================================
          SECTION 4: MARKETING ANALYTICS (UNCHANGED)
      ===================================================================================== */}
      <h2 className="text-2xl font-bold text-white px-1 pt-8 pb-2 tracking-tight">Marketing Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COL 1: CAMPAIGN STATS */}
        <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Campaign Stats</h3>
            <MoreVertical size={20} className="text-slate-500 cursor-pointer hover:text-white" />
          </div>
          <div className="space-y-6">
            <CampaignRow label="Campaigns" value="54" percent="28%" color="text-emerald-400" icon={Calendar} iconBg="bg-pink-500" ring="ring-pink-500/30" />
            <CampaignRow label="Emailed" value="245" percent="15%" color="text-red-400" icon={Mail} iconBg="bg-emerald-500" ring="ring-emerald-500/30" />
            <CampaignRow label="Opened" value="54" percent="30.5%" color="text-emerald-400" icon={ArrowUpRight} iconBg="bg-cyan-500" ring="ring-cyan-500/30" />
            <CampaignRow label="Clicked" value="859" percent="34.6%" color="text-red-400" icon={MousePointer2} iconBg="bg-yellow-500" ring="ring-yellow-500/30" />
            <CampaignRow label="Subscribed" value="24,758" percent="53%" color="text-emerald-400" icon={Users} iconBg="bg-blue-600" ring="ring-blue-600/30" />
          </div>
        </div>

        {/* COL 2: VISITORS GROWTH */}
        <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl flex flex-col justify-between overflow-hidden relative">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
           
           <div className="flex-1 min-h-[200px] w-full relative z-10">
             <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                 </linearGradient>
               </defs>
               <path d="M0 80 C 40 80, 50 20, 100 50 S 160 80, 200 20 V 100 H 0 Z" fill="url(#visitorGradient)" />
               <path d="M0 80 C 40 80, 50 20, 100 50 S 160 80, 200 20" 
                     fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" 
                     className="drop-shadow-[0_4px_10px_rgba(74,222,128,0.4)]" />
               <circle cx="100" cy="50" r="5" fill="#0f172a" stroke="#4ade80" strokeWidth="3" />
               <circle cx="200" cy="20" r="5" fill="#0f172a" stroke="#4ade80" strokeWidth="3" />
             </svg>
           </div>
           
           <div className="mt-6 relative z-10 bg-[#0f172a]/80 backdrop-blur-sm p-4 rounded-xl border border-slate-800/50">
             <div className="flex items-end gap-3 mb-2">
               <h2 className="text-5xl font-black text-white tracking-tighter">36.7%</h2>
               <span className="text-emerald-400 text-sm font-bold mb-3 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded">
                 <ArrowUpRight size={14} className="mr-1" /> Growth
               </span>
             </div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">Visitor Engagement</p>

             <div className="space-y-5">
               <ProgressBar label="Clicks" value="2,589" color="bg-gradient-to-r from-pink-500 to-rose-500" width="60%" />
               <ProgressBar label="Likes" value="6,748" color="bg-gradient-to-r from-amber-400 to-orange-500" width="85%" />
               <ProgressBar label="Upvotes" value="9,842" color="bg-gradient-to-r from-cyan-400 to-blue-500" width="45%" />
             </div>
           </div>
        </div>

        {/* COL 3: SOCIAL LEADS */}
        <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Social Leads</h3>
            <MoreVertical size={20} className="text-slate-500 cursor-pointer hover:text-white" />
          </div>
          <div className="space-y-7">
            <SocialRow platform="Facebook" percent={55} color="bg-blue-600" text="text-blue-200" stroke="#3b82f6" />
            <SocialRow platform="LinkedIn" percent={67} color="bg-blue-500" text="text-blue-200" stroke="#60a5fa" />
            <SocialRow platform="Instagram" percent={78} color="bg-pink-600" text="text-pink-200" stroke="#ec4899" />
            <SocialRow platform="Snapchat" percent={46} color="bg-yellow-400" text="text-yellow-900" stroke="#facc15" />
            <SocialRow platform="Google" percent={38} color="bg-red-500" text="text-red-200" stroke="#ef4444" />
            <SocialRow platform="Spotify" percent={12} color="bg-green-500" text="text-green-200" stroke="#22c55e" />
          </div>
        </div>
      </div>

      {/* =====================================================================================
          SECTION 5: USERS & ORDERS (REDESIGNED FOR BEAUTY)
      ===================================================================================== */}
      <h2 className="text-2xl font-bold text-white px-1 pt-8 pb-2 tracking-tight">User Activity</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COL 1: NEW USERS LIST - REDESIGNED */}
        <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl flex flex-col h-full relative overflow-hidden">
           {/* Subtle top glow */}
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></div>
           
           <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">New Users</h3>
              <p className="text-slate-400 text-xs mt-1">Real-time user registration</p>
            </div>
            <button className="bg-slate-800/50 p-2.5 rounded-xl hover:bg-slate-700 hover:text-white text-slate-400 transition-all ring-1 ring-slate-700/50">
               <MoreVertical size={18} />
            </button>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[420px]">
            <UserRow name="Elon Jonado" handle="elon_deo" status="online" img="https://i.pravatar.cc/150?u=1" />
            <UserRow name="Alexzender Clito" handle="zli_alexzender" status="offline" img="https://i.pravatar.cc/150?u=2" />
            <UserRow name="Michle Tinko" handle="tinko_michle" status="online" img="https://i.pravatar.cc/150?u=3" />
            <UserRow name="Kail Wemba" handle="wemba_kl" status="busy" img="https://i.pravatar.cc/150?u=4" />
            <UserRow name="Henhco Tino" handle="henhco_tino" status="online" img="https://i.pravatar.cc/150?u=5" />
            <UserRow name="Gonjiko Fernando" handle="gonjiko_fernando" status="offline" img="https://i.pravatar.cc/150?u=6" />
          </div>
          
          {/* Bottom Action Bar */}
          <div className="grid grid-cols-5 gap-2 pt-6 border-t border-slate-800/60 mt-4">
             <IconButton icon={ArrowUpRight} color="text-blue-400" bg="hover:bg-blue-500/10" />
             <IconButton icon={MessageSquare} color="text-purple-400" bg="hover:bg-purple-500/10" />
             <IconButton icon={Mail} color="text-pink-400" bg="hover:bg-pink-500/10" />
             <IconButton icon={Paperclip} color="text-emerald-400" bg="hover:bg-emerald-500/10" />
             <IconButton icon={Calendar} color="text-amber-400" bg="hover:bg-amber-500/10" />
          </div>
        </div>

        {/* COL 2: RECENT ORDERS - REDESIGNED */}
        <div className="lg:col-span-2 rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl flex flex-col h-full relative overflow-hidden">
           {/* Background Grid Accent */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

           <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Recent Orders</h3>
              <p className="text-slate-400 text-xs mt-1">Transaction history and status</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-all">
                <Filter size={14} /> Filter
              </button>
              <button className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                  <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mb-8 group z-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input 
              type="text" 
              placeholder="Search items, vendors, IDs..." 
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-900 transition-all duration-300 shadow-inner"
            />
          </div>

          {/* Glassmorphic Table */}
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-700/50">
                  <th className="pb-4 pl-4 font-semibold">Item Name</th>
                  <th className="pb-4 font-semibold">Amount</th>
                  <th className="pb-4 font-semibold">Vendor</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Rating</th>
                  <th className="pb-4 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <OrderRow name="Sports Shoes" price="$149.00" vendor="Julia Sunota" status="Completed" rating="5.0" statusStyle="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" />
                <OrderRow name="Golden Watch" price="$168.50" vendor="Mike R. Anson" status="Completed" rating="4.8" statusStyle="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" />
                <OrderRow name="Men Polo Tshirt" price="$124.00" vendor="Polo Official" status="Pending" rating="4.0" statusStyle="bg-amber-500/10 text-amber-400 border-amber-500/20" />
                <OrderRow name="Blue Jeans" price="$289.99" vendor="Levis Store" status="Processing" rating="4.5" statusStyle="bg-blue-500/10 text-blue-400 border-blue-500/20" />
                <OrderRow name="Fancy Shirts" price="$389.00" vendor="Zara Fashion" status="Canceled" rating="2.0" statusStyle="bg-red-500/10 text-red-400 border-red-500/20" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------
// BEAUTIFIED HELPER COMPONENTS
// ------------------------------------------

function DarkMetricCard({ title, value, sub, icon: Icon, color, bg, border }: any) {
  return (
    <div className={`rounded-[2rem] bg-[#0f172a] p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${border}`}>
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
        <Icon size={64} className={color} />
      </div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-4 rounded-2xl ${bg} group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 ${color} backdrop-blur-sm`}>
          +2.5%
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
          {sub}
        </p>
      </div>
    </div>
  );
}

function CampaignRow({ label, value, percent, color, icon: Icon, iconBg, ring }: any) {
  return (
    <div className="flex items-center justify-between group p-2 hover:bg-slate-800/30 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${iconBg} text-white shadow-lg ring-4 ${ring} group-hover:scale-105 transition-transform`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm font-bold text-white">{value}</span>
        <span className={`text-xs font-black ${color} bg-slate-800 px-2 py-1 rounded-md min-w-[3rem] text-center`}>{percent}</span>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, color, width }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-2 font-semibold">
        <span className="text-slate-300">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div className={`h-full ${color} rounded-full shadow-[0_0_10px_currentColor]`} style={{ width: width }} />
      </div>
    </div>
  );
}

function SocialRow({ platform, percent, color, text, stroke }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color} shadow-lg group-hover:scale-110 transition-transform`}>
           <span className={`font-bold text-sm ${text}`}>{platform[0]}</span>
        </div>
        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{platform}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-white">{percent}%</span>
        <div className="relative h-9 w-9">
           <svg className="h-full w-full -rotate-90 drop-shadow-md" viewBox="0 0 36 36">
             <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
             <path className="transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={stroke} strokeWidth="4" strokeDasharray={`${percent}, 100`} strokeLinecap="round" />
           </svg>
        </div>
      </div>
    </div>
  );
}

// REDESIGNED USER ROW
function UserRow({ name, handle, img, status }: any) {
  const statusColor = status === "online" ? "bg-emerald-500" : status === "busy" ? "bg-amber-500" : "bg-slate-500";
  
  return (
    <div className="flex items-center justify-between p-3.5 hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer group border border-transparent hover:border-slate-700/50 hover:shadow-lg hover:shadow-slate-900/20">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12">
          <img src={img} alt={name} className="h-full w-full rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-blue-500 transition-all duration-300" />
          <div className={`absolute bottom-0 right-0 h-3.5 w-3.5 ${statusColor} border-[3px] border-[#0f172a] rounded-full`}></div>
        </div>
        <div>
          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{name}</p>
          <p className="text-xs text-slate-500 font-medium group-hover:text-slate-400">@{handle}</p>
        </div>
      </div>
      <div className="h-9 w-9 rounded-full border border-slate-700/50 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
        <ArrowUpRight size={16} />
      </div>
    </div>
  );
}

// REDESIGNED ICON BUTTON
function IconButton({ icon: Icon, color, bg }: any) {
  return (
    <button className={`text-slate-400 p-3 rounded-xl transition-all hover:scale-110 active:scale-95 ${color} ${bg}`}>
      <Icon size={20} strokeWidth={2} />
    </button>
  );
}

// REDESIGNED ORDER ROW
function OrderRow({ name, price, vendor, status, rating, statusStyle }: any) {
  return (
    <tr className="group hover:bg-slate-800/30 transition-colors border-b border-slate-800/50 last:border-0">
      <td className="py-4 pl-4 rounded-l-2xl group-hover:bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex-shrink-0 shadow-inner flex items-center justify-center text-xs font-bold text-slate-500">
             IMG
          </div>
          <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{name}</span>
        </div>
      </td>
      <td className="py-4 font-bold text-white group-hover:bg-slate-800/20">{price}</td>
      <td className="py-4 text-slate-400 font-medium group-hover:bg-slate-800/20">{vendor}</td>
      <td className="py-4 group-hover:bg-slate-800/20">
        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border shadow-sm ${statusStyle}`}>{status}</span>
      </td>
      <td className="py-4 group-hover:bg-slate-800/20">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold">
          {rating} <Star size={14} className="fill-amber-400 text-amber-400" />
        </div>
      </td>
      <td className="py-4 pr-4 rounded-r-2xl text-right group-hover:bg-slate-800/20">
         <button className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg">
            <ChevronRight size={16} />
         </button>
      </td>
    </tr>
  );
}