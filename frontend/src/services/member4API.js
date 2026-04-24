/**
 * Member 4 - Authentication API Service
 * Handles all authentication and user management API calls
 */

const API_BASE = 'http://localhost:8081/api';

export const authAPI = {
  /**
   * Login with Google OAuth token
   */
  loginWithGoogle: async (googleToken) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleToken }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  /**
   * Get user profile
   */
  getUserProfile: async (userId) => {
    const response = await fetch(`${API_BASE}/auth/profile/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId, firstName, lastName) => {
    const response = await fetch(
      `${API_BASE}/auth/profile/${userId}?firstName=${firstName}&lastName=${lastName}`,
      { method: 'PUT' }
    );
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  /**
   * Logout
   */
  logout: async (userId) => {
    const response = await fetch(`${API_BASE}/auth/logout?userId=${userId}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.text();
  },

  /**
   * Verify user is authenticated
   */
  verifyUser: async (userId) => {
    const response = await fetch(`${API_BASE}/auth/verify/${userId}`);
    if (!response.ok) throw new Error('Verification failed');
    return response.json();
  },
};

/**
 * Notification API Service
 */
export const notificationAPI = {
  /**
   * Get all notifications for user
   */
  getUserNotifications: async (userId, limit = 50) => {
    const response = await fetch(
      `${API_BASE}/notifications/${userId}?limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  /**
   * Get unread notifications
   */
  getUnreadNotifications: async (userId) => {
    const response = await fetch(
      `${API_BASE}/notifications/${userId}/unread`
    );
    if (!response.ok) throw new Error('Failed to fetch unread notifications');
    return response.json();
  },

  /**
   * Get unread count
   */
  getUnreadCount: async (userId) => {
    const response = await fetch(
      `${API_BASE}/notifications/${userId}/count`
    );
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return response.json();
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    const response = await fetch(
      `${API_BASE}/notifications/${notificationId}/read`,
      { method: 'PUT' }
    );
    if (!response.ok) throw new Error('Failed to mark as read');
    return response.json();
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (userId) => {
    const response = await fetch(
      `${API_BASE}/notifications/${userId}/read-all`,
      { method: 'PUT' }
    );
    if (!response.ok) throw new Error('Failed to mark all as read');
    return response.json();
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId) => {
    const response = await fetch(
      `${API_BASE}/notifications/${notificationId}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('Failed to delete notification');
    return response.json();
  },

  /**
   * Delete all notifications
   */
  deleteAllNotifications: async (userId) => {
    const response = await fetch(
      `${API_BASE}/notifications/${userId}/all`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('Failed to delete all notifications');
    return response.json();
  },
};

/**
 * Role Management API Service
 */
export const roleAPI = {
  /**
   * Change user role (Admin only)
   */
  changeUserRole: async (userId, newRole, adminId, reason = '') => {
    const response = await fetch(`${API_BASE}/roles/change?adminId=${adminId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        newRole,
        reason,
      }),
    });
    if (!response.ok) throw new Error('Failed to change role');
    return response.json();
  },

  /**
   * Get all users (Admin only)
   */
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE}/roles/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  /**
   * Get users by role (Admin only)
   */
  getUsersByRole: async (role) => {
    const response = await fetch(`${API_BASE}/roles/users/by-role/${role}`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  /**
   * Toggle user status (Admin only)
   */
  toggleUserStatus: async (userId, active) => {
    const response = await fetch(
      `${API_BASE}/roles/users/${userId}/status?active=${active}`,
      { method: 'PUT' }
    );
    if (!response.ok) throw new Error('Failed to toggle user status');
    return response.json();
  },
};
