import {
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  SendHorizontal,
} from "lucide-react";

export default function ChatWindow({ selectedFriendDetails }) {
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

            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <h2 className="font-bold text-lg text-gray-900">{`${selectedFriendDetails?.firstName} ${selectedFriendDetails?.lastName}`}</h2>

            {selectedFriendDetails.isOnline && (
              <p className="text-green-500 text-sm">• Online</p>
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
        {/* Left */}
        <div className="flex">
          <div className="bg-white rounded-xl px-4 py-3 max-w-xs shadow-sm">
            <p className="text-gray-800">Hey! 👋</p>
            <span className="text-xs text-gray-400 mt-2 block">10:21 AM</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-end">
          <div className="bg-violet-600 text-white rounded-xl px-4 py-3 max-w-xs">
            <p>Hello Emma!</p>
            <span className="text-[11px] text-violet-100 mt-2 block">
              10:22 AM
            </span>
          </div>
        </div>

        {/* Left */}
        <div className="flex">
          <div className="bg-white rounded-xl px-4 py-3 max-w-xs shadow-sm">
            <p>How's Connectify going?</p>
            <span className="text-xs text-gray-400 mt-2 block">10:24 AM</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-end">
          <div className="bg-violet-600 text-white rounded-xl px-4 py-3 max-w-xs">
            <p>Almost finished 😄</p>
            <span className="text-[11px] text-violet-100 mt-2 block">
              10:25 AM
            </span>
          </div>
        </div>

        {/* Left */}
        <div className="flex">
          <div className="bg-white rounded-xl px-4 py-3 max-w-xs shadow-sm">
            <p>Looks amazing 🚀</p>
            <span className="text-xs text-gray-400 mt-2 block">10:26 AM</span>
          </div>
        </div>
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
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none text-sm"
        />

        <button className="w-11 h-11 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition">
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
