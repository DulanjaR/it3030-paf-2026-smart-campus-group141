import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
              className="block px-6 py-3 hover:bg-gray-800 transition-colors"
            >
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
            <h2 className="text-2xl font-bold text-gray-900">Smart Campus Operations</h2>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
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
