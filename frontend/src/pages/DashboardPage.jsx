import { useEffect, useState } from 'react';
import { Calendar, AlertCircle, Package, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/apiClient';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalResources: 0,
    activeBookings: 0,
    openTickets: 0,
    recentNotifications: 0,
  });

  useEffect(() => {
    fetchResources();
    fetchActiveBookings();
    fetchOpenTickets();
    fetchNotifications();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await apiClient.get('/resources');
      setStats((prev) => ({
        ...prev,
        totalResources: res.data.totalElements,
      }));
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const fetchOpenTickets = async () => {
    try {
      const res = await apiClient.get('/tickets/filter/status', {
        params: { status: 'OPEN', page: 0, size: 1 },
      });

      setStats((prev) => ({
        ...prev,
        openTickets: res.data?.totalElements ?? 0,
      }));
    } catch (error) {
      console.error('Error fetching open tickets:', error);
    }
  };

  const fetchActiveBookings = async () => {
    try {
      const res = await apiClient.get('/bookings');
      setStats((prev) => ({
        ...prev,
        activeBookings: Array.isArray(res.data) ? res.data.length : 0,
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const res = await apiClient.get(`/notifications/${user.id}/count`);
      setStats((prev) => ({
        ...prev,
        recentNotifications: res.data?.unreadCount ?? 0,
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Resources Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalResources}
              </p>
            </div>
            <Package className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.activeBookings}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Open Tickets */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.openTickets}
              </p>
            </div>
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.recentNotifications}
              </p>
            </div>
            <Bell className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Welcome</h2>
        <p className="mt-2 text-gray-600">
          Start by exploring the navigation menu to manage your resources, bookings, and tickets.
        </p>
      </div>
    </div>
  );
}