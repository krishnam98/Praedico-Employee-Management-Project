"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, ArrowUpRight, Mail, Phone, Briefcase, Building2, User, UserCheck, Lock, Shield, Users, Activity, Clock, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ChangePasswordModal from "../_components/ChangePasswordModal";
// import UserManagementModal from "../_components/UserManagementModal";


export default function AdminDashboard() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);


  // 1. STATS DATA
  const [stats] = useState({
    totalUsers: "1,248",
    activeUsers: "482",
    createdTasks: "24",
    totalIncome: "$42.5K"
  });

  const [chartData] = useState([
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 700 },
  ]);

  // 2. DYNAMIC NAME STATE
  const [adminName, setAdminName] = useState("Admin");
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  // const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);



  // 3. DECODE TOKEN FOR NAME
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (data.success && data.data) {
          setAdminName(data.data.name || "Admin");
          setUserData(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch admin profile", e);
        router.push("/");
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
              We're glad to see you again. Manage your tasks and view your profile details below.
            </p>
          </div>
        </div>
      </div>



      {/* CONDITIONAL CONTENT BASED ON ROLE */}
      {userData && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          {userData.role === 'ADMIN' ? (
            <>
              {/* ADMIN VIEW: METRICS & GRAPHS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DarkMetricCard
                  title="Total Income" value={stats.totalIncome} sub="+12.5% vs last month"
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
                  title="Created Tasks" value={stats.createdTasks} sub="Requires attention"
                  icon={Clock} color="text-orange-400" bg="bg-orange-500/10" border="group-hover:border-orange-500/50"
                />
              </div>

              {/* GRAPHS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-[2.5rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <TrendingUp className="text-indigo-400" size={20} />
                        Performance Analytics
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">Daily user engagement over the last 7 days</p>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '1rem' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-[2.5rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <BarChart3 className="text-purple-400" size={20} />
                        Workload Distribution
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">Resource allocation by department</p>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '1rem' }}
                        />
                        <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* EMPLOYEE VIEW: PROFILE & INFO */}
              <AdminProfileSummary user={userData} />

              <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl relative overflow-hidden group transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
                  <UserCheck className="text-indigo-400" />
                  Employee Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <InfoCard
                    title="Employee ID"
                    value={userData.employeeId || userData._id}
                    icon={User}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                  />
                  <InfoCard
                    title="Category"
                    value={userData.category || "General"}
                    icon={Briefcase}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                  />
                  <InfoCard
                    title="Designation"
                    value={userData.designation || "Administrator"}
                    icon={Building2}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                  />
                  <InfoCard
                    title="Employment Type"
                    value={userData.employeeType || "Regular"}
                    icon={Shield}
                    color={userData.employeeType === "Regular" ? "text-emerald-400" : "text-amber-400"}
                    bg={userData.employeeType === "Regular" ? "bg-emerald-500/10" : "bg-amber-500/10"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800">
                  <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Department</p>
                    <p className="text-lg font-bold text-blue-400">{userData.category || "Administration"}</p>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Join Date</p>
                    <p className="text-lg font-bold text-purple-400">
                      {new Date(userData.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Role Status</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {userData.role} {userData.isSeniorEmployee ? "(Senior)" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Settings for Employee */}
              <div className="flex justify-center mt-12 pb-8">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="group relative overflow-hidden px-10 py-6 rounded-[2rem] font-bold transition-all duration-300 bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 hover:border-indigo-500/50 hover:scale-[1.02] shadow-xl hover:shadow-indigo-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3 text-xl">
                    <Lock className="h-6 w-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
                    Security Settings: Change Password
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />


    </div>
  );
}

// ------------------------------------------
// BEAUTIFIED HELPER COMPONENTS
// ------------------------------------------

// PROFILE HELPER COMPONENTS
function AdminProfileSummary({ user }: { user: any }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-700 group-hover:bg-indigo-500/10"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-3">
          <User className="text-indigo-400" />
          Profile Summary
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="relative h-32 w-32 p-[3px] rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg group-hover:rotate-3 transition-transform duration-500">
              <div className="h-full w-full rounded-2xl bg-[#0f172a] overflow-hidden flex items-center justify-center">
                {!imgError ? (
                  <img
                    src={user.avatar || "/avatars/admin-face.png"}
                    alt={user.name}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="font-bold text-white text-4xl bg-gradient-to-br from-indigo-500 to-purple-600 w-full h-full flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">{user.name}</h3>
              <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                <Briefcase size={14} className="text-indigo-400" />
                {user.designation || "Administrative Head"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email" value={user.email} />
              <InfoItem icon={Phone} label="Phone" value={user.phoneNumber || "Not Provided"} />
              <InfoItem icon={Building2} label="Category" value={user.category || "Administration"} />
              <InfoItem icon={User} label="Employee ID" value={user.employeeId || user._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all group/item">
      <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover/item:bg-indigo-500/20 group-hover/item:scale-110 transition-all">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm text-white font-semibold truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all group/card">
      <div className={`p-4 rounded-xl ${bg} ${color} group-hover/card:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-lg text-white font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}
// METRICS ROW HELPER
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
