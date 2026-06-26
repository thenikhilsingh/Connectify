import { UserPlus, Check, X, Heart, MessageCircle, Bell } from "lucide-react";

export default function Notifications() {
  const requests = [
    {
      id: 1,
      name: "Emma Watson",
      mutual: 12,
      time: "2 min ago",
      image: "https://i.pravatar.cc/150?img=21",
    },
    {
      id: 2,
      name: "Noah Brown",
      mutual: 8,
      time: "25 min ago",
      image: "https://i.pravatar.cc/150?img=22",
    },
    {
      id: 3,
      name: "Sophia Lee",
      mutual: 15,
      time: "1 hour ago",
      image: "https://i.pravatar.cc/150?img=23",
    },
  ];

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
              {requests.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border rounded-2xl p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.image}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>

                      <p className="text-gray-500 text-sm">
                        {user.mutual} Mutual Friends
                      </p>

                      <p className="text-xs text-gray-400 mt-1">{user.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl flex items-center gap-2">
                      <Check size={18} />
                      Accept
                    </button>

                    <button className="bg-gray-100 hover:bg-red-100 text-gray-700 px-5 py-2 rounded-xl flex items-center gap-2">
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
