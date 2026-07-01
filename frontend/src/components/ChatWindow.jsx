import {
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  SendHorizontal,
} from "lucide-react";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket/socket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function ChatWindow({ selectedFriend, selectedFriendDetails }) {
  const api = useAxios();
  const { user, onlineUsers } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  dayjs.extend(relativeTime);
  const bottomRef = useRef(null);

  const getMessages = async () => {
    try {
      const response = await api.get(`/api/messages/${selectedFriend}`);
      console.log(response);
      setMessages(response.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedFriend) {
      getMessages();
    }
  }, [selectedFriend]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      sender: user._id,
      reciever: selectedFriend,
      text: message,
    });

    setMessage("");
  };

  useEffect(() => {
    socket.on("messageSent", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("messageSent");
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="bg-white rounded-3xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedFriendDetails?.profilePicture || "/dp.png"}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />

            {onlineUsers.includes(selectedFriend) && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          <div>
            <h2 className="font-bold text-lg text-gray-900">{`${selectedFriendDetails?.firstName} ${selectedFriendDetails?.lastName}`}</h2>

            {onlineUsers.includes(selectedFriend) ? (
              <p className="text-green-500 text-sm">• Online</p>
            ) : (
              <p className="text-gray-500 text-sm">• Offline</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-violet-600">
            <Phone size={18} />
          </button>

          <button className="hover:text-violet-600">
            <Video size={18} />
          </button>

          <button className="hover:text-violet-600">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-[#FAFAFC]">
        {messages.map((message) => {
          return user._id === message.sender ? (
            <div key={message._id} className="flex justify-end">
              <div className="bg-violet-600 text-white rounded-xl px-4 py-3 max-w-xs">
                <p>{message?.text}</p>
                <span className="text-[11px] text-violet-100 mt-2 block">
                  {dayjs(message?.createdAt).fromNow()}
                </span>
              </div>
            </div>
          ) : (
            <div key={message._id} className="flex">
              <div className="bg-white rounded-xl px-4 py-3 max-w-xs shadow-sm">
                <p className="text-gray-800">{message?.text}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {dayjs(message?.createdAt).fromNow()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="border-t px-4 py-3 flex items-center gap-3 bg-white">
        <button className="text-gray-500 hover:text-violet-600">
          <Smile size={20} />
        </button>

        <button className="text-gray-500 hover:text-violet-600">
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none text-sm"
        />

        <button
          onClick={handleSendMessage}
          className="w-11 h-11 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
