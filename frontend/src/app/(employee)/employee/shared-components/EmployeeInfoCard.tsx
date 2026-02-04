import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeInfoCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
    bg?: string;
    border?: string;
    subtitle?: string;
}

export function EmployeeInfoCard({
    title,
    value,
    icon: Icon,
    color = "text-blue-400",
    bg = "bg-blue-500/10",
    border = "group-hover:border-blue-500/50",
    subtitle
}: EmployeeInfoCardProps) {
    return (
        <div className={cn(
            "rounded-[2rem] bg-[#0f172a] p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden",
            border
        )}>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                <Icon size={64} className={color} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5", bg)}>
                    <Icon className={cn("h-6 w-6", color)} />
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                {subtitle && (
                    <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
