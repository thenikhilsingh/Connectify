export default function ChatCard({ name, avatar, online }) {
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
        </div>
      </div>
    </div>
  );
}
