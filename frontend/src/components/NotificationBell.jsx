import React, { useState } from 'react';
import { Bell } from 'lucide-react';

/**
 * Member 4 - NotificationBell Component
 * Badge showing unread notification count
 * Integrated into Layout header
 */
function NotificationBell({ unreadCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      title={`Notifications${unreadCount > 0 ? `: ${unreadCount} unread` : ''}`}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
