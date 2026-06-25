export default function ChatCard({
  name,
  message,
  avatar,
  online,
  time,
  unread,
}) {
  return (
    <div className="flex items-center justify-between bg-[#F4F1FF] hover:bg-[#EEE9FF] rounded-2xl p-3 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-14 h-14 rounded-full object-cover"
          />

          {online && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full"></span>
          )}
        </div>

        <div>
          <h3 className="font-bold text-[18px] text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 mt-1 truncate max-w-45">
            {message}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <span className="text-xs text-gray-400">{time}</span>

        {unread > 0 && (
          <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-semibold flex items-center justify-center">
            {unread}
          </div>
        )}
      </div>
    </div>
  );
}
