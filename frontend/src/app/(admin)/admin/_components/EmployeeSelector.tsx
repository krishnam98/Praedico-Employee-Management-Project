"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, User, Users, X, Loader2, Square, CheckSquare } from "lucide-react";
import axios from "axios";

export interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  designation: string;
  email: string;
}

interface EmployeeSelectorProps {
  multiSelect?: boolean;
  value: string | string[];
  onChange: (value: any) => void;
  label?: string;
  placeholder?: string;
  allEmployees?: Employee[];
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
  placeholder = "Select employee(s)",
  allEmployees: externalEmployees
}: EmployeeSelectorProps) {
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>(externalEmployees || []);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDesignationOpen, setIsDesignationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCache, setSelectedCache] = useState<Employee[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const designationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalEmployees) {
      setAllEmployees(externalEmployees);
    } else {
      fetchAllEmployees();
    }
  }, [externalEmployees]);

  const fetchAllEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/employees`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }
        }
      );
      if (response.data.success) {
        setAllEmployees(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter employees by current selected designation for the employee dropdown
  useEffect(() => {
    if (selectedDesignation) {
      setEmployees(allEmployees.filter(emp => emp.designation === selectedDesignation));
    } else {
      setEmployees([]);
    }
  }, [selectedDesignation, allEmployees]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (designationRef.current && !designationRef.current.contains(event.target as Node)) {
        setIsDesignationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleEmployee = (empId: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? [...value] : [];
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

  const handleToggleDesignation = (designation: string) => {
    if (!multiSelect) {
      setSelectedDesignation(designation);
      setIsDesignationOpen(false);
      return;
    }

    const currentValues = Array.isArray(value) ? [...value] : [];
    const employeesInDesignation = allEmployees.filter(emp => emp.designation === designation);
    const employeeIdsInDesignation = employeesInDesignation.map(emp => emp._id);

    if (employeeIdsInDesignation.length === 0) return;

    const areAllSelected = employeeIdsInDesignation.every(id => currentValues.includes(id));

    if (areAllSelected) {
      // Deselect all from this designation
      onChange(currentValues.filter(id => !employeeIdsInDesignation.includes(id)));
    } else {
      // Select all from this designation
      const newValues = Array.from(new Set([...currentValues, ...employeeIdsInDesignation]));
      onChange(newValues);
    }
  };

  const isDesignationSelected = (designation: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    const employeesInDesignation = allEmployees.filter(emp => emp.designation === designation);
    if (employeesInDesignation.length === 0) return false;
    return employeesInDesignation.every(emp => currentValues.includes(emp._id));
  };

  const handleSelectAll = () => {
    if (!multiSelect) return;
    const allEmpIds = employees.map(emp => emp._id);
    const currentValues = Array.isArray(value) ? value : [];
    
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
      const selected = allEmployees.find(e => e._id === value);
      if (selected) return `${selected.name} - (${selected.employeeId})`;
      return "Employee selected";
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Designation Selection */}
        <div className="relative group" ref={designationRef}>
            <button
                type="button"
                onClick={() => setIsDesignationOpen(!isDesignationOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 border ${isDesignationOpen ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-slate-700'} rounded-xl text-white transition-all hover:bg-slate-800/80`}
            >
                <span className="truncate text-sm font-medium">
                    {selectedDesignation || "Select Designation"}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isDesignationOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDesignationOpen && (
                <div className="absolute z-[130] mt-2 w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {DESIGNATIONS.map(d => {
                            const selected = isDesignationSelected(d);
                            const empCount = allEmployees.filter(e => e.designation === d).length;
                            const isActive = selectedDesignation === d;
                            
                            return (
                                <div
                                    key={d}
                                    className={`flex items-center gap-2 px-3 py-2 transition-colors rounded-xl group cursor-pointer ${isActive ? 'bg-indigo-600/10' : 'hover:bg-slate-800'}`}
                                >
                                    {multiSelect && (
                                        <div 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleDesignation(d);
                                            }}
                                            className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600 group-hover:border-slate-500'}`}
                                        >
                                            {selected && <Check className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                    )}
                                    
                                    <div 
                                        className="flex-1 flex items-center justify-between"
                                        onClick={() => {
                                            setSelectedDesignation(d);
                                            if (!multiSelect) setIsDesignationOpen(false);
                                        }}
                                    >
                                        <span className={`text-sm font-medium ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>
                                            {d}
                                        </span>
                                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 group-hover:bg-slate-700 transition-colors">
                                            {empCount}
                                        </span>
                                    </div>
                                    
                                    {!multiSelect && isActive && <Check className="h-3 w-3 text-indigo-400" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>

        {/* Employee Selection Dropdown */}
        <div className="relative" ref={dropdownRef}>
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
                            <p className="text-sm font-bold truncate max-w-[180px]">
                              {emp.name} <span className="text-[11px] font-medium text-slate-500 ml-1">({emp.employeeId})</span>
                            </p>
                            <p className={`text-[10px] uppercase font-extrabold tracking-widest mt-0.5 ${isSelected(emp._id) ? 'text-indigo-400/80' : 'text-slate-500'}`}>
                              {emp.designation}
                            </p>
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
            const cachedEmp = allEmployees.find(e => e._id === id);
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

