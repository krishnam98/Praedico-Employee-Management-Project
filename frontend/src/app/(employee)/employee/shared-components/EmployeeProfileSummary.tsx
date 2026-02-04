import React, { useState } from "react";
import { Employee } from "../_components/employeeData";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Building2 } from "lucide-react";

interface EmployeeProfileSummaryProps {
    employee: Employee;
}

export function EmployeeProfileSummary({ employee }: EmployeeProfileSummaryProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="rounded-[2rem] bg-[#0f172a] p-8 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Profile Summary</h2>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                        <div className="relative h-32 w-32 p-[3px] rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 shadow-lg">
                            <div className="h-full w-full rounded-2xl bg-[#0f172a] overflow-hidden flex items-center justify-center">
                                {!imgError ? (
                                    <img
                                        src={employee.avatar}
                                        alt={employee.name}
                                        className="h-full w-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <span className="font-bold text-white text-4xl bg-gradient-to-br from-indigo-500 to-purple-600 w-full h-full flex items-center justify-center">
                                        {employee.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{employee.name}</h3>
                            <p className="text-slate-400 text-sm mt-1">{employee.designation}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem icon={Mail} label="Email" value={employee.email} />
                            <InfoItem icon={Phone} label="Phone" value={employee.phone} />
                            <InfoItem icon={Building2} label="Department" value={employee.department} />
                            <InfoItem icon={Briefcase} label="Category" value={employee.category} />
                            <InfoItem icon={User} label="Employee ID" value={employee.id} />
                            <InfoItem icon={Calendar} label="Join Date" value={new Date(employee.joinDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} />
                        </div>

                        {/* Employee Type Badge */}
                        <div className="pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-400 font-medium">Employment Type:</span>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${employee.employeeType === "Regular"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    }`}>
                                    {employee.employeeType === "Regular" ? "Regular Employee" : `Temporary - ${employee.temporaryType}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm text-white font-medium truncate mt-0.5">{value}</p>
            </div>
        </div>
    );
}
