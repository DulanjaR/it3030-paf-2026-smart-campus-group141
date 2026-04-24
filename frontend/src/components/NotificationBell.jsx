import React, { useState } from 'react';
import { Bell } from 'lucide-react';

/**
 * Member 4 - NotificationBell Component
 * Badge showing unread notification count
 * Integrated into Layout header
 */
function NotificationBell({ userId, unreadCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      title="Notifications"
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
