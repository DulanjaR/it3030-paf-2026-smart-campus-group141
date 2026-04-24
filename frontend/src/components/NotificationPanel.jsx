import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../services/apiClient';

/**
 * Member 4 - NotificationPanel Component
 * Displays user notifications in a dropdown panel
 */
function NotificationPanel({ userId, isOpen, onClose, onNotificationsChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications();
    }
  }, [isOpen, userId]);

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const response = await apiClient.get(`/notifications/${userId}`, {
        params: { limit: 10 },
      });
      setNotifications(response.data || []);

      const countResponse = await apiClient.get(`/notifications/${userId}/count`);
      setUnreadCount(countResponse.data?.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      await fetchNotifications();
      onNotificationsChange?.();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.put(`/notifications/${userId}/read-all`);
      await fetchNotifications();
      onNotificationsChange?.();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
      await fetchNotifications();
      onNotificationsChange?.();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING_APPROVED':
      case 'BOOKING_REJECTED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'TICKET_RESOLVED':
      case 'TICKET_STATUS_CHANGED':
      case 'COMMENT_ADDED':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-3xl shadow-2xl z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
          <p className="text-xs text-gray-500">{unreadCount} unread</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3 border-b border-gray-200 flex gap-2">
        <button
          onClick={handleMarkAllAsRead}
          className="flex-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
        >
          Mark all read
        </button>
        <button
          onClick={fetchNotifications}
          className="flex-1 rounded-xl bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-5 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            <Bell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-700">No notifications yet</p>
            <p className="text-xs text-gray-500">Check back later for updates.</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-3 transition ${
                  notification.read ? 'border-gray-100 bg-white' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                    <p className="mt-1 text-xs text-gray-600">{notification.message}</p>
                    <div className="mt-3 flex gap-2 text-[11px] font-medium">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-4 py-3 text-center">
        <a href="/notifications" className="text-sm font-semibold text-blue-600 hover:underline">
          View all notifications
        </a>
      </div>
    </div>
  );
}

export default NotificationPanel;
