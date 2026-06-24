import { Bell, MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <input
        type="text"
        placeholder="Search users, posts..."
        className="w-112.5 h-11 rounded-xl bg-gray-50 border px-4"
      />

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />

        <MessageCircle className="cursor-pointer" />

        <img
          src="https://i.pravatar.cc/150"
          alt=""
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}
