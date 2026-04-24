import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Shield, Edit, Lock, Unlock, AlertCircle } from 'lucide-react';
import apiClient from '../services/apiClient';

export default function RoleManagementPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('STUDENT');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'ADMIN') {
      setError('You do not have permission to access this page');
      return;
    }
    
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Mock users data - in production, fetch from backend
      const mockUsers = [
        {
          id: 1,
          firstName: 'Dulanja',
          lastName: 'Ranasinghe',
          email: 'dulanja@smartcampus.local',
          role: 'ADMIN',
          active: true,
        },
        {
          id: 2,
          firstName: 'Sahan',
          lastName: 'Silva',
          email: 'sahan@smartcampus.local',
          role: 'STAFF',
          active: true,
        },
        {
          id: 3,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@smartcampus.local',
          role: 'STUDENT',
          active: true,
        },
        {
          id: 4,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@smartcampus.local',
          role: 'STUDENT',
          active: false,
        },
      ];
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (u) => {
    setSelectedUser(u);
    setNewRole(u.role);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      // API call to update role
      await apiClient.patch(`/users/${selectedUser.id}/role`, {
        role: newRole,
      });

      // Update local state
      setUsers(users.map(u =>
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));

      setSuccess(`Role updated to ${newRole}`);
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleActive = async (u) => {
    try {
      const endpoint = u.active ? `/users/${u.id}/deactivate` : `/users/${u.id}/activate`;
      await apiClient.post(endpoint);

      setUsers(users.map(user =>
        user.id === u.id ? { ...user, active: !user.active } : user
      ));

      setSuccess(`User ${u.active ? 'deactivated' : 'activated'} successfully`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-3" />
        <h2 className="text-lg font-semibold text-red-900">Access Denied</h2>
        <p className="text-red-700 mt-2">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user roles and permissions
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Shield className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'ADMIN'
                          ? 'bg-red-100 text-red-800'
                          : u.role === 'STAFF'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        u.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditRole(u)}
                          className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                          title="Edit role"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`p-2 rounded-lg transition ${
                            u.active
                              ? 'hover:bg-red-100 text-red-600'
                              : 'hover:bg-green-100 text-green-600'
                          }`}
                          title={u.active ? 'Deactivate' : 'Activate'}
                        >
                          {u.active ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Update Role for {selectedUser.firstName} {selectedUser.lastName}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
