import React, { useState, useEffect } from 'react';
import { Users, Shield, Trash2, CheckCircle } from 'lucide-react';

/**
 * Member 4 - RoleManagementPage Component
 * Admin panel for managing user roles (USER, TECHNICIAN, ADMIN)
 * Admin only feature
 */
function RoleManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newRole, setNewRole] = useState('USER');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/roles/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load users',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId) => {
    try {
      const response = await fetch('http://localhost:8081/api/roles/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newRole,
          reason: 'Role change via admin panel',
        }),
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Role updated successfully',
        });
        fetchUsers();
        setSelectedUserId(null);
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      console.error('Error changing role:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update role',
      });
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/roles/users/${userId}/status?active=${!currentStatus}`,
        { method: 'PUT' }
      );

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        });
        fetchUsers();
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update user status',
      });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'TECHNICIAN':
        return 'bg-blue-100 text-blue-800';
      case 'USER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Role Management
          </h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <p>Loading users...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          user.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => setSelectedUserId(user.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() =>
                          handleToggleStatus(user.id, user.active)
                        }
                        className={`font-medium ${
                          user.active
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {user.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Change Role Modal */}
        {selectedUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Change User Role</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="USER">User</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleChangeRole(selectedUserId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Update Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleManagementPage;
