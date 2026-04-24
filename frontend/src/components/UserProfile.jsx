import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  if (!user) return null;

  // Generate user avatar with initials
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  
  // Generate a consistent avatar background color based on user ID
  const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-lime-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  const avatarColor = colors[Math.abs(user.id % colors.length)];

  // Get role display text with styling
  const getRoleBadgeStyle = (role) => {
    const roleStyles = {
      ADMIN: 'bg-red-100 text-red-800',
      STAFF: 'bg-blue-100 text-blue-800',
      STUDENT: 'bg-green-100 text-green-800',
      FACULTY: 'bg-purple-100 text-purple-800',
    };
    return roleStyles[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        {/* Avatar */}
        {user.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm`}
          >
            {initials}
          </div>
        )}

        {/* Name and Chevron */}
        <div className="flex items-center gap-2">
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <ChevronDown size={18} className="text-gray-600" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              {user.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-14 h-14 rounded-full object-cover border-3 border-white"
                />
              ) : (
                <div
                  className={`w-14 h-14 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-lg border-3 border-white`}
                >
                  {initials}
                </div>
              )}

              {/* User Info */}
              <div className="flex-1">
                <h3 className="text-white font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-blue-100 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Role Badge */}
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-600 mb-2 font-medium">ROLE</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeStyle(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </div>

          {/* Account Info */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600 font-medium">EMAIL</p>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
              {user.id && (
                <div>
                  <p className="text-xs text-gray-600 font-medium">USER ID</p>
                  <p className="text-sm text-gray-900 font-mono">{user.id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3 font-semibold"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
