'use client';

import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/adminApi';
import { User } from '@/types/admin';
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { Search, Shield, ShieldOff, Crown } from 'lucide-react';
import { motion } from 'motion/react';

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    return users.filter(user => {
      const matchesSearch = 
        (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      return matchesSearch;
    });
  }, [users, searchTerm]);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getUsers(token, page, limit, searchTerm);
        setUsers(data?.users || []);
        setTotal(data?.total || 0);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users');
        setUsers([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token, page, limit, searchTerm]);

  const handleToggleActive = async (user: User) => {
    if (!token) return;

    try {
      setIsUpdating(true);
      await adminApi.updateUserStatus(token, user._id, !user.isActive);
      
      // Refresh users list
      const data = await adminApi.getUsers(token, page, limit);
      setUsers(data.users);
      
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePromoteToAdmin = async (user: User) => {
    if (!token) return;

    try {
      setIsUpdating(true);
      const updatedUser = await adminApi.promoteUserToAdmin(token, user._id);
      
      // Update selected user
      setSelectedUser(updatedUser);
      
      // Refresh users list
      const data = await adminApi.getUsers(token, page, limit);
      setUsers(data.users);
    } catch (err) {
      console.error('Failed to promote user:', err);
      setError(err instanceof Error ? err.message : 'Failed to promote user to admin');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
        <p className="text-gray-400">Manage user accounts and permissions</p>
      </motion.div>

      {error && (
        <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-600"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          columns={[
            { key: 'fullName', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'mobile', label: 'Mobile' },
            { key: 'totalTicketsPurchased', label: 'Tickets' },
            {
              key: 'totalAmountSpent',
              label: 'Total Spent',
              render: (value) => `₹${value?.toLocaleString() || 0}`,
            },
            {
              key: 'role',
              label: 'Role',
              render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  value && (value === 'admin' || value === 'super_admin')
                    ? 'bg-amber-600/20 text-amber-400'
                    : 'bg-gray-600/20 text-gray-400'
                }`}>
                  {value === 'super_admin' ? 'Super Admin' : value === 'admin' ? 'Admin' : 'User'}
                </span>
              ),
            },
            {
              key: 'isActive',
              label: 'Status',
              render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  value ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {value ? 'Active' : 'Inactive'}
                </span>
              ),
            },
            {
              key: 'createdAt',
              label: 'Joined',
              render: (value) => new Date(value).toLocaleDateString(),
            },
          ]}
          data={filteredUsers}
          isLoading={isLoading}
          pagination={{
            page,
            limit,
            total,
            onPageChange: setPage,
          }}
          onRowClick={handleViewDetails}
          actions={[
            {
              label: 'View',
              onClick: (row) => handleViewDetails(row),
            },
            {
              label: (row) => row.isActive ? 'Deactivate' : 'Activate',
              onClick: (row) => handleToggleActive(row),
              variant: (row) => row.isActive ? 'danger' : 'default',
            },
          ]}
        />
      </motion.div>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen && !!selectedUser}
        title="User Details"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        size="md"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Full Name</p>
                <p className="text-white font-medium">{selectedUser.fullName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Mobile</p>
                <p className="text-white font-medium">{selectedUser.mobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Gender</p>
                <p className="text-white font-medium">{selectedUser.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Date of Birth</p>
                <p className="text-white font-medium">
                  {selectedUser.dateOfBirth 
                    ? new Date(selectedUser.dateOfBirth).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Tickets</p>
                  <p className="text-2xl font-bold text-pink-500">{selectedUser.totalTicketsPurchased}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-green-500">₹{selectedUser.totalAmountSpent?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Account Status</p>
                  <p className={`text-white font-medium ${selectedUser.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Role</p>
                  <p className={`text-white font-medium ${
                    selectedUser.role && (selectedUser.role === 'admin' || selectedUser.role === 'super_admin')
                      ? 'text-amber-400'
                      : 'text-gray-400'
                  }`}>
                    {selectedUser.role === 'super_admin' ? 'Super Admin' : selectedUser.role === 'admin' ? 'Admin' : 'User'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-3">
              <button
                onClick={() => handleToggleActive(selectedUser)}
                disabled={isUpdating}
                className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  selectedUser.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedUser.isActive ? (
                  <>
                    <ShieldOff size={18} />
                    Deactivate Account
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Activate Account
                  </>
                )}
              </button>

              {selectedUser.role !== 'admin' && selectedUser.role !== 'super_admin' && (
                <button
                  onClick={() => handlePromoteToAdmin(selectedUser)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Crown size={18} />
                  Promote to Admin
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
