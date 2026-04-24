import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Bell, Trash2, Check, AlertCircle } from 'lucide-react';
import apiClient from '../services/apiClient';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(filter);
    }
  }, [user?.id, filter]);

  const fetchNotifications = async (selectedFilter = filter) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const endpoint =
        selectedFilter === 'unread'
          ? `/notifications/${user.id}/unread`
          : `/notifications/${user.id}`;
      const res = await apiClient.get(endpoint, {
        params: {
          limit: 50,
        },
      });

      setNotifications(res.data || []);

      // Fetch unread count
      const countRes = await apiClient.get(`/notifications/${user.id}/count`);
      setUnreadCount(countRes.data?.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.put(`/notifications/${user.id}/read-all`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = 'h-5 w-5';
    switch (type) {
      case 'BOOKING_APPROVED':
        return <Check className={`${iconClass} text-green-600`} />;
      case 'BOOKING_REJECTED':
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case 'TICKET_CREATED':
        return <Bell className={`${iconClass} text-blue-600`} />;
      case 'TICKET_RESOLVED':
        return <Check className={`${iconClass} text-green-600`} />;
      case 'COMMENT_ADDED':
        return <Bell className={`${iconClass} text-purple-600`} />;
      case 'RESOURCE_AVAILABLE':
        return <Check className={`${iconClass} text-blue-600`} />;
      default:
        return <Bell className={`${iconClass} text-gray-600`} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'BOOKING_APPROVED':
        return 'bg-green-50 border-green-200';
      case 'BOOKING_REJECTED':
        return 'bg-red-50 border-red-200';
      case 'TICKET_CREATED':
        return 'bg-blue-50 border-blue-200';
      case 'TICKET_RESOLVED':
        return 'bg-green-50 border-green-200';
      case 'COMMENT_ADDED':
        return 'bg-purple-50 border-purple-200';
      case 'RESOURCE_AVAILABLE':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <Check className="h-4 w-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setFilter('all');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => {
            setFilter('unread');
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unread Only {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition border-l-4 ${
                  notification.read ? 'border-l-transparent' : 'border-l-blue-600'
                } ${getTypeColor(notification.type)}`}
              >
                {/* Icon */}
                <div className="mt-1 shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold ${
                    notification.read ? 'text-gray-700' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                      className="p-2 rounded-lg hover:bg-gray-200 transition text-gray-600 hover:text-gray-900"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    title="Delete"
                    className="p-2 rounded-lg hover:bg-red-100 transition text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
