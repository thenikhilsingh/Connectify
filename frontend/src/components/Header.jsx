import { Bell, MessageCircle } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, notificationCount } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hello,
          <span className="text-violet-600 ml-2">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="inline-block ml-2 origin-bottom-right animate-[wave_1.5s_ease-in-out_infinite]">
            👋
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/app/notifications")}
        >
          <Bell />

          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>

        <MessageCircle
          onClick={() => navigate("/app/messages")}
          className="cursor-pointer"
        />

        <img
          src={user?.profilePicture || "/dp.png"}
          alt=""
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}
