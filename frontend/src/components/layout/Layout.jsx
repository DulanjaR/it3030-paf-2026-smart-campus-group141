import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, LogOut, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import apiClient from '../../services/apiClient';
import NotificationBell from '../NotificationBell';
import NotificationPanel from '../NotificationPanel';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
      // Refresh unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  useEffect(() => {
    if (notificationsOpen && user?.id) {
      fetchUnreadCount();
    }
  }, [notificationsOpen, user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [notificationsOpen]);

  const fetchUnreadCount = async () => {
    try {
      const res = await apiClient.get(`/notifications/${user.id}/count`);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Resources', href: '/resources' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'Notifications', href: '/notifications' },
    ...(user?.role === 'ADMIN' ? [
      { label: 'Admin', href: '/admin/roles', icon: Settings },
    ] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-6">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Smart Campus</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-800 p-2 rounded"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              {item.icon && <item.icon size={20} />}
              {sidebarOpen && item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Campus</h2>
              {user && (
                <p className="text-sm text-gray-500 mt-1">
                  Welcome, {user.firstName} ({user.role})
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 relative" ref={panelRef}>
              <NotificationBell
                unreadCount={unreadCount}
                onClick={() => setNotificationsOpen((open) => !open)}
              />
              <NotificationPanel
                userId={user?.id}
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                onNotificationsChange={fetchUnreadCount}
              />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
