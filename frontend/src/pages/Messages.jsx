import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import ChatInfo from "../components/ChatInfo";

export default function Messages() {
  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 p-5">
      {/* Left */}
      <div className="w-80">
        <ChatList />
      </div>

      {/* Center */}
      <div className="flex-1">
        <ChatWindow />
      </div>

      {/* Right */}
      <div className="w-80">
        <ChatInfo />
      </div>
    </div>
  );
}
