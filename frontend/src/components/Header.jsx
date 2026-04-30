import { NavLink, useNavigate } from "react-router-dom";
import { Bell, Ticket, CalendarCheck, Home, LogOut, UserCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-1 text-blue-700 font-semibold"
      : "flex items-center gap-1 hover:text-blue-700";

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to="/welcome" className="text-2xl font-bold text-blue-700">
          SmartCampus
        </NavLink>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <NavLink to="/welcome" className={linkClass}>
            <Home size={18} /> Home
          </NavLink>

          <NavLink to="/catalogue" className={linkClass}>
            Resources
          </NavLink>

          <NavLink to="/my-bookings" className={linkClass}>
            <CalendarCheck size={18} /> Bookings
          </NavLink>

          <NavLink to="/my-tickets" className={linkClass}>
            <Ticket size={18} /> Tickets
          </NavLink>

          <NavLink to="/my-notifications" className={linkClass}>
            <Bell size={18} /> Notifications
          </NavLink>

          <NavLink
            to="/profile"
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
          >
            <UserCircle size={20} />
            {user?.firstName || user?.email || "Profile"}
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}