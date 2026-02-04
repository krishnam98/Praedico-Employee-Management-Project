"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  UserCheck,
  UserX,
  Ban,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
  registeredUsers: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function UserManagementModal({
  isOpen,
  onClose,
}: UserManagementModalProps) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    blockedUsers: 0,
    registeredUsers: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Modal States
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // ============================================
  // API FUNCTIONS
  // ============================================

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        role: roleFilter,
        status: statusFilter,
      });

      const response = await axios.get(
        `http://localhost:5000/api/users/all?${params}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/stats",
        { withCredentials: true }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/users/${userId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        fetchUsers();
        fetchStats();
        setDeleteModalOpen(false);
        setSelectedUser(null);
        alert("User deleted successfully!");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Toggle User Active Status
// Toggle User Active Status
const handleToggleActive = async (userId: string) => {
  console.log("🔄 Toggling user status for ID:", userId); // Debug log
  
  try {
    const response = await axios.patch(
      `http://localhost:5000/api/users/${userId}/toggle-active`,
      {}, // Empty body
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("✅ Toggle response:", response.data); // Debug log

    if (response.data.success) {
      alert(response.data.message || "User status updated successfully!");
      fetchUsers();
      fetchStats();
      setActionMenuOpen(null);
    }
  } catch (err: any) {
    console.error("❌ Toggle error:", err); // Debug log
    console.error("❌ Error response:", err.response); // Debug log
    
    const errorMessage = err.response?.data?.message || 
                        err.message || 
                        "Failed to toggle user status";
    
    alert(errorMessage);
  }
};


  // Export to CSV
  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Role", "Status", "Joined"],
      ...users.map((u) => [
        u.name,
        u.email,
        u.role,
        u.isActive && u.isVerified
          ? "Active"
          : !u.isActive
          ? "Blocked"
          : "Inactive",
        new Date(u.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString()}.csv`;
    a.click();
  };

  // ============================================
  // EFFECTS
  // ============================================

  // Fetch data on mount and when filters change
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchStats();
    }
  }, [isOpen, pagination.page, searchQuery, roleFilter, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchQuery, roleFilter, statusFilter]);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getStatusBadge = (user: User) => {
    if (user.isActive && user.isVerified) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Active
        </span>
      );
    } else if (!user.isActive) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
          Blocked
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
          Inactive
        </span>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // ============================================
  // STATS CARDS DATA
  // ============================================

  const statsCards = [
    {
      icon: Users,
      label: "Active Users",
      value: stats.activeUsers.toString(),
      change: "+12%",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: UserCheck,
      label: "Inactive Users",
      value: stats.inactiveUsers.toString(),
      change: "-5%",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      icon: UserX,
      label: "Registered Users",
      value: stats.registeredUsers.toString(),
      change: "+23%",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: Ban,
      label: "Blocked Users",
      value: stats.blockedUsers.toString(),
      change: "+2",
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  ];

  // ============================================
  // RENDER
  // ============================================

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col animate-in zoom-in-95 duration-300">
        {/* Gradient Border Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

        {/* Header */}
        <div className="relative p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-200 border border-slate-700/50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                User Management
              </h2>
              <p className="text-slate-400 mt-1">
                Manage and monitor all users in your system
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-slate-800/40 border border-slate-700/50 p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${stat.bg} ring-1 ring-white/5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color} border border-current/20`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-bold text-white tracking-tight">
                    {stat.value}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12 bg-slate-800/20 rounded-2xl border border-slate-700/50">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <span className="ml-3 text-slate-400 font-medium">
                Loading users...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Search Bar and Filters */}
          {!loading && (
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="unverified">Unverified</option>
              </select>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                <Download className="h-5 w-5" />
                <span>Export</span>
              </button>
            </div>
          )}

          {/* Users Table */}
          {!loading && users.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/60 border-b border-slate-700/50">
                      <th className="text-left py-4 px-6 text-slate-400 font-semibold text-sm tracking-wide">
                        User
                      </th>
                      <th className="text-left py-4 px-6 text-slate-400 font-semibold text-sm tracking-wide">
                        Role
                      </th>
                      <th className="text-left py-4 px-6 text-slate-400 font-semibold text-sm tracking-wide">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-slate-400 font-semibold text-sm tracking-wide">
                        Last Active
                      </th>
                      <th className="text-left py-4 px-6 text-slate-400 font-semibold text-sm tracking-wide">
                        Joined
                      </th>
                      <th className="text-left py-4 px-6 text-slate-400 font-semibold text-sm tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors group"
                      >
                        {/* User Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-semibold">
                                {user.name}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 capitalize">
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">{getStatusBadge(user)}</td>

                        {/* Last Active */}
                        <td className="py-4 px-6">
                          <span className="text-slate-300 text-sm">
                            {getTimeAgo(user.lastActive || user.lastLogin)}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="py-4 px-6">
                          <span className="text-slate-300 text-sm">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {/* View */}
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setViewModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-slate-700/50 hover:bg-blue-600 text-slate-400 hover:text-white transition-all"
                              title="View User"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setEditModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-slate-700/50 hover:bg-green-600 text-slate-400 hover:text-white transition-all"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setDeleteModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-slate-700/50 hover:bg-red-600 text-slate-400 hover:text-white transition-all"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            {/* 3-Dot Menu */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActionMenuOpen(
                                    actionMenuOpen === user._id
                                      ? null
                                      : user._id
                                  )
                                }
                                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-all"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {actionMenuOpen === user._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-10 overflow-hidden">
                                  <button
                                    onClick={() => handleToggleActive(user._id)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm font-medium"
                                  >
                                    {user.isActive ? "Block User" : "Unblock User"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setViewModalOpen(true);
                                      setActionMenuOpen(null);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm font-medium"
                                  >
                                    View Details
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && users.length === 0 && !error && (
            <div className="text-center py-12 bg-slate-800/20 rounded-2xl border border-slate-700/50">
              <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No users found</p>
              <p className="text-slate-500 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && users.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-slate-400 text-sm">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} users
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <span className="text-slate-300 text-sm font-medium px-4">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View User Modal */}
        {viewModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">User Details</h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Role</p>
                  <p className="text-white font-semibold capitalize">
                    {selectedUser.role}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  {getStatusBadge(selectedUser)}
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Joined</p>
                  <p className="text-white font-semibold">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Delete User?
                </h3>
                <p className="text-slate-400 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    {selectedUser.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteUser(selectedUser._id)}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
}
