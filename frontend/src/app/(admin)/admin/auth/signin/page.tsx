"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, Github } from "lucide-react";
import axios from "axios";
import { Button } from "@/app/(admin)/admin/shared-components/ui/button";
import { Input } from "@/app/(admin)/admin/shared-components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/(admin)/admin/shared-components/ui/card";
import { Label } from "@/app/(admin)/admin/shared-components/ui/label";

export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Connect to backend (adjusting port if necessary, backend was running on 5000 in index.js)
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Check if user is an admin
        if (response.data.data.role !== "ADMIN") {
           setError("Access denied. Admin privileges required.");
           setLoading(false);
           return;
        }

        // Store token in localStorage (premium apps might use cookies, but this is a solid start)
        localStorage.setItem("admin_token", response.data.data.token);
        localStorage.setItem("admin_user", JSON.stringify(response.data.data));

        // Redirect to dashboard
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements - Premium Glassmorphism Feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 ring-1 ring-white/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Portal</span>
          </h1>
          <p className="text-slate-400 mt-3 font-medium">Secure access to management dashboard</p>
        </div>

        <Card className="bg-[#1e293b]/40 backdrop-blur-2xl border-slate-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden group hover:border-slate-700/50 transition-all duration-500">
          <CardHeader className="space-y-1 pb-6 pt-8 text-center px-8">
            <CardTitle className="text-2xl font-bold text-white tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400 text-sm font-medium">
              Please enter your credentials to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 ml-1 text-sm font-semibold">Email Address</Label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-14 bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 rounded-2xl transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300 ml-1 text-sm font-semibold">Password</Label>
                  <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Recovery Mode?</a>
                </div>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 h-14 bg-slate-900/60 border-slate-700/50 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 rounded-2xl transition-all duration-300"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    {error}
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-lg shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Sign In to Portal <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 border-t border-slate-800/30 pt-8 pb-10 px-8">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800/60"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <span className="bg-[#1e293b]/10 backdrop-blur-md px-4 py-1 rounded-full border border-slate-800/60">Security Protocols Active</span>
              </div>
            </div>
            
            <p className="text-center text-slate-500 text-xs">
              This is a restricted area. All access is logged and monitored. 
              <br />
              Authorized personnel only.
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center mt-8 text-slate-500 text-sm font-medium">
          &copy; 2026 <span className="text-slate-400">Praedico</span> Enterprise Security
        </p>
      </div>
    </div>
  );
}
