import {
  Phone,
  Video,
  MoreVertical,
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

dayjs.extend(relativeTime);
export default function ChatWindow({ selectedFriend, selectedFriendDetails }) {
  const api = useAxios();
  const { user, onlineUsers } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;

    if (selectedFile) {
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("reciever", selectedFriend);
      formData.append("text", message);

      try {
        const response = await api.post("/api/messages/upload", formData);

        setMessages((prev) => [...prev, response.data.newMessage]);

        setSelectedFile(null);
        setMessage("");
      } catch (error) {
        console.log(error);
      }

      return;
    }

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

  useEffect(() => {
    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stopTyping", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  const typingTimeout = useRef();
  const handleChange = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", {
      sender: user._id,
      reciever: selectedFriend,
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        sender: user._id,
        reciever: selectedFriend,
      });
    }, 1000);
  };

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

            {isTyping ? (
              <p className="text-violet-500 text-sm">Typing...</p>
            ) : onlineUsers.includes(selectedFriend) ? (
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
              <div className="bg-violet-600 text-white rounded-2xl overflow-hidden max-w-sm">
                {message.file?.url &&
                  (message.file.type.startsWith("image") ? (
                    <img
                      src={message.file.url}
                      alt=""
                      className="w-full max-h-72 object-cover"
                    />
                  ) : (
                    <a
                      href={message.file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 pt-4 text-white underline"
                    >
                      📎 {message.file.originalName}
                    </a>
                  ))}

                {(message.text || !message.file?.url) && (
                  <div className="px-4 py-3">
                    <p>{message.text}</p>
                  </div>
                )}

                <div className="px-4 pb-2 flex justify-end">
                  <span className="text-[11px] text-violet-100">
                    {dayjs(message.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div key={message._id} className="flex">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-sm">
                {message.file?.url &&
                  (message.file.type.startsWith("image") ? (
                    <img
                      src={message.file.url}
                      alt=""
                      className="w-full max-h-72 object-cover"
                    />
                  ) : (
                    <a
                      href={message.file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 pt-4 text-violet-600 underline"
                    >
                      📎 {message.file.originalName}
                    </a>
                  ))}

                {(message.text || !message.file?.url) && (
                  <div className="px-4 py-3">
                    <p className="text-gray-800">{message.text}</p>
                  </div>
                )}

                <div className="px-4 pb-2 flex justify-end">
                  <span className="text-[11px] text-gray-400">
                    {dayjs(message.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="border-t bg-white">
        {selectedFile && (
          <div className="px-4 py-2 text-sm bg-gray-100">
            📎 {selectedFile.name}
          </div>
        )}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Hidden File Input */}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="text-gray-500 hover:text-violet-600"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleChange}
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
    </div>
  );
}
