import { useEffect, useState } from 'react';
import { Calendar, AlertCircle, Package, Bell } from 'lucide-react';

export default function DashboardPage() {
  const [stats] = useState({
    totalResources: 0,
    activeBookings: 0,
    openTickets: 0,
    recentNotifications: 0,
  });

  useEffect(() => {
    // TODO: Fetch dashboard data from API
  }, []);

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

        {/* Active Bookings Card */}
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

        {/* Open Tickets Card */}
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

        {/* Notifications Card */}
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
