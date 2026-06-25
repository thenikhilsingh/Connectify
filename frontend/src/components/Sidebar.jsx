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
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { LogoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <aside className="w-60 h-screen border-r bg-white sticky top-0 flex flex-col">
      <div className="p-6">
        <img src="/logo.png" className="h-8" alt="" />
      </div>

      <nav className="px-4 flex-1">
        <ul className="space-y-2">
          <li className="flex items-center gap-3 p-3 rounded-lg bg-violet-100 text-violet-600">
            <House size={20} />
            Home
          </li>

          <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Compass size={20} />
            Explore
          </li>

          <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Bell size={20} />
            Notifications
          </li>

          <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <MessageCircle size={20} />
            Messages
          </li>

          <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <User size={20} />
            Profile
          </li>

          <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Settings size={20} />
            Settings
          </li>
        </ul>

        <div>
          <button
            onClick={() => {
              LogoutUser();
              navigate("/logout");
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-2 text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="flex gap-3 items-center">
          <img
            src="https://i.pravatar.cc/150"
            alt=""
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-sm text-gray-500">@johndoe</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
