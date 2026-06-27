import {
  House,
  Compass,
  Bell,
  MessageCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { LogoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      isActive
        ? "bg-violet-100 text-violet-600 font-medium"
        : "hover:bg-gray-100 text-gray-700"
    }`;

  return (
    <aside className="w-60 h-screen border-r bg-white sticky top-0 flex flex-col">
      <div className="p-6">
        <img src="/logo.png" className="h-8" alt="Logo" />
      </div>

      <nav className="px-4 flex-1">
        <ul className="space-y-2">
          <li>
            <NavLink to="/app" end className={navLinkClass}>
              <House size={20} />
              <span>Home</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/app/explore" className={navLinkClass}>
              <Compass size={20} />
              <span>Explore</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/app/notifications" className={navLinkClass}>
              <Bell size={20} />
              <span>Notifications</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/app/messages" className={navLinkClass}>
              <MessageCircle size={20} />
              <span>Messages</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/app/profile" className={navLinkClass}>
              <User size={20} />
              <span>Profile</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/app/settings" className={navLinkClass}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>

        <button
          onClick={() => {
            LogoutUser();
            navigate("/logout");
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-2 text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h3 className="font-semibold">
              {user?.firstName} {user?.lastName}
            </h3>
          </div>
        </div>
      </div>
    </aside>
  );
}
