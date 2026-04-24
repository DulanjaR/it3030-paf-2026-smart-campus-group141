import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Member 4 - NotificationPanel Component
 * Displays user notifications (booking approvals, ticket updates, comments)
 * Integrates with notification endpoints
 */
function NotificationPanel({ userId, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/notifications/${userId}?limit=20`
      );
      const data = await response.json();
      setNotifications(data);

      // Get unread count
      const countResponse = await fetch(
        `http://localhost:8081/api/notifications/${userId}/count`
      );
      const countData = await countResponse.json();
      setUnreadCount(countData.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:8081/api/notifications/${notificationId}/read`,
        { method: 'PUT' }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(
        `http://localhost:8081/api/notifications/${userId}/read-all`,
        { method: 'PUT' }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:8081/api/notifications/${notificationId}`,
        { method: 'DELETE' }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING_APPROVED':
      case 'BOOKING_REJECTED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'TICKET_UPDATE':
      case 'TICKET_STATUS_CHANGED':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={`fixed right-0 top-16 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="border-b border-gray-200 p-3 flex gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="flex-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded px-3 py-2 transition"
          >
            Mark All Read
          </button>
          <button
            onClick={fetchNotifications}
            className="flex-1 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 rounded px-3 py-2 transition"
          >
            Refresh
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {!notification.read && (
                          <button
                            onClick={() =>
                              handleMarkAsRead(notification.id)
                            }
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="text-xs text-gray-500 hover:text-gray-700 font-medium"
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
      </div>
    </div>
  );
}

export default NotificationPanel;
