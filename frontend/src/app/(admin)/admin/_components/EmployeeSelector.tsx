"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, User, Users, X, Loader2 } from "lucide-react";
import axios from "axios";

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  designation: string;
}

interface EmployeeSelectorProps {
  multiSelect?: boolean;
  value: string | string[];
  onChange: (value: any) => void;
  label?: string;
  placeholder?: string;
}

const DESIGNATIONS = [
  "CEO", "CTO", "COO", "Director", "General Manager",
  "Project Manager", "Product Manager", "Team Lead",
  "Junior Developer", "Senior Developer", "Engineering Manager"
];

export default function EmployeeSelector({
  multiSelect = false,
  value,
  onChange,
  label = "Select Employee",
  placeholder = "Select employee(s)"
}: EmployeeSelectorProps) {
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCache, setSelectedCache] = useState<Employee[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch employees when designation changes
  useEffect(() => {
    if (selectedDesignation) {
      fetchEmployees();
    } else {
      setEmployees([]);
    }
  }, [selectedDesignation]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/employees-by-designation`,
        {
          params: { designation: selectedDesignation },
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }
        }
      );
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update selection cache to keep track of names/IDs even when designation changes
  useEffect(() => {
    if (employees.length > 0) {
      const currentValArray = Array.isArray(value) ? value : [value];
      const newItems = employees.filter(emp => 
        currentValArray.includes(emp._id) && 
        !selectedCache.find(c => c._id === emp._id)
      );
      if (newItems.length > 0) {
        setSelectedCache(prev => [...prev, ...newItems]);
      }
    }
  }, [employees, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleEmployee = (empId: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(empId)) {
        onChange(currentValues.filter(id => id !== empId));
      } else {
        onChange([...currentValues, empId]);
      }
    } else {
      onChange(empId);
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (!multiSelect) return;
    const allEmpIds = employees.map(emp => emp._id);
    const currentValues = Array.isArray(value) ? value : [];
    
    // If all are already selected, deselect all. Otherwise, select all.
    if (allEmpIds.every(id => currentValues.includes(id))) {
      onChange(currentValues.filter(id => !allEmpIds.includes(id)));
    } else {
      const newValues = Array.from(new Set([...currentValues, ...allEmpIds]));
      onChange(newValues);
    }
  };

  const isSelected = (empId: string) => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(empId);
    }
    return value === empId;
  };

  const getSelectedDisplay = () => {
    if (multiSelect) {
      const count = Array.isArray(value) ? value.length : 0;
      if (count === 0) return placeholder;
      return `${count} employee(s) selected`;
    } else {
      if (!value) return placeholder;
      const selected = selectedCache.find(e => e._id === value) || employees.find(e => e._id === value);
      if (selected) return `${selected.name} - (${selected.employeeId})`;
      return "Employee selected";
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4" ref={dropdownRef}>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Designation Selection */}
        <div className="relative group">
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none group-hover:text-indigo-400 transition-colors" />
          <select
            value={selectedDesignation}
            onChange={(e) => {
                setSelectedDesignation(e.target.value);
                setSearchTerm("");
            }}
            className="w-full pl-4 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none font-medium"
          >
            <option value="" className="bg-slate-900">Select Designation First</option>
            {DESIGNATIONS.map(d => (
              <option key={d} value={d} className="bg-slate-900">{d}</option>
            ))}
          </select>
        </div>

        {/* Employee Selection Dropdown */}
        <div className="relative">
          <button
            type="button"
            disabled={!selectedDesignation}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 border ${isOpen ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-slate-700'} rounded-xl text-white transition-all hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className={`truncate text-sm font-medium ${!value || (Array.isArray(value) && value.length === 0) ? 'text-slate-500' : 'text-white'}`}>
              {getSelectedDisplay()}
            </span>
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-indigo-400" /> : <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
          </button>

          {isOpen && (
            <div className="absolute z-[120] mt-2 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                {multiSelect && employees.length > 0 && (
                  <div className="flex items-center justify-between mt-3 px-1">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                    >
                      <Users className="h-3 w-3" />
                      {Array.isArray(value) && employees.map(e => e._id).every(id => value.includes(id)) ? "Deselect All From This Designation" : "Select All From This Designation"}
                    </button>
                  </div>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar overflow-x-hidden">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading Employees...</span>
                  </div>
                ) : filteredEmployees.length > 0 ? (
                  <div className="p-1">
                    {filteredEmployees.map((emp) => (
                      <button
                        key={emp._id}
                        type="button"
                        onClick={() => handleToggleEmployee(emp._id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${isSelected(emp._id) ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'}`}
                      >
                        <div className="flex items-center gap-3">
                          {multiSelect ? (
                            <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${isSelected(emp._id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600 group-hover:border-slate-500'}`}>
                              {isSelected(emp._id) && <Check className="h-3.5 w-3.5 text-white" />}
                            </div>
                          ) : (
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${isSelected(emp._id) ? 'bg-indigo-600/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                              <User className={`h-4 w-4 ${isSelected(emp._id) ? 'text-indigo-400' : 'text-slate-500'}`} />
                            </div>
                          )}
                          <div className="text-left">
                            <p className="text-sm font-bold truncate max-w-[150px]">{emp.name}</p>
                            <p className={`text-[10px] uppercase font-bold tracking-tighter ${isSelected(emp._id) ? 'text-indigo-400/70' : 'text-slate-500'}`}>{emp.employeeId}</p>
                          </div>
                        </div>
                        {!multiSelect && isSelected(emp._id) && <Check className="h-4 w-4 text-indigo-400" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-xs font-medium italic">No employees found for this designation.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected tags for Multi-select */}
      {multiSelect && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-900/30 rounded-2xl border border-slate-800/50">
          {value.map(id => {
            const cachedEmp = selectedCache.find(e => e._id === id) || employees.find(e => e._id === id);
            return (
              <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold animate-in zoom-in duration-200">
                <User className="h-3 w-3" />
                {cachedEmp ? cachedEmp.employeeId : id.slice(-6)}
                <button
                  type="button"
                  onClick={() => handleToggleEmployee(id)}
                  className="hover:text-rose-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors ml-auto flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear All
          </button>
        </div>
      )}
    </div>
  );
}
