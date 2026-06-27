import { UserPlus, Check, X, Heart, MessageCircle, Bell } from "lucide-react";
import { useState } from "react";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";

export default function Notifications() {
  const api = useAxios();
  const [friendRequests, setFriendRequests] = useState([]);
  const getFriendRequests = async () => {
    try {
      const response = await api.get("/api/people/requestNotifications");
      console.log(response, "requests");
      setFriendRequests(response.data.notifications);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriendRequests();
  }, []);

  const notifications = [
    {
      id: 1,
      icon: <Heart className="text-red-500" size={18} />,
      text: "Emma Watson liked your post.",
      time: "10 min ago",
    },
    {
      id: 2,
      icon: <MessageCircle className="text-blue-500" size={18} />,
      text: "James commented on your photo.",
      time: "1 hour ago",
    },
    {
      id: 3,
      icon: <Bell className="text-violet-600" size={18} />,
      text: "Welcome to Connectify 🎉",
      time: "Today",
    },
  ];
  const getRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);

    const diff = Math.floor((now - past) / 1000); // seconds

    if (diff < 60) return "Just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const acceptOrDeniedRequest = async (id, action) => {
    try {
      const response = await api.put(
        `/api/people/acceptOrDeniedRequest/${id}`,
        {
          status: action,
        },
      );
      if (response.status === 200) {
        getFriendRequests();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>

        <div className="grid grid-cols-[1.3fr_1fr] gap-6">
          {/* Friend Requests */}

          <div className="bg-white rounded-3xl shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="text-violet-600" />
              <h2 className="text-2xl font-bold">Friend Requests</h2>
            </div>

            <div className="space-y-5">
              {friendRequests.map((request) => (
                <div
                  key={request?.sender?._id}
                  className="flex items-center justify-between border rounded-2xl p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={request?.sender?.profilePicture || "/dp.png"}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-lg">
                        {`${request?.sender?.firstName} ${request?.sender?.lastName}`}
                      </h3>

                      <p className="text-gray-500 text-sm">0 Mutual Friends</p>

                      <p className="text-xs text-gray-400 mt-1">
                        {request?.updatedAt &&
                          getRelativeTime(request.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        acceptOrDeniedRequest(request._id, "accepted")
                      }
                      className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                    >
                      <Check size={18} />
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        acceptOrDeniedRequest(request._id, "rejected")
                      }
                      className="bg-gray-100 hover:bg-red-100 text-gray-700 px-5 py-2 rounded-xl flex items-center gap-2"
                    >
                      <X size={18} />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}

          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>

            <div className="space-y-5">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {item.icon}
                  </div>

                  <div>
                    <p className="font-medium">{item.text}</p>

                    <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
