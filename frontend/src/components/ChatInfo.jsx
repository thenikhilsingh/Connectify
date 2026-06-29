import { BellOff, FileText, ImageIcon } from "lucide-react";

export default function ChatInfo({ selectedFriendDetails }) {
  const media = [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=200",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200",
  ];

  const files = [
    {
      name: "Resume.pdf",
      size: "2.4 MB",
    },
    {
      name: "Design.fig",
      size: "14 MB",
    },
  ];

  return (
    <div className="bg-white rounded-3xl h-full flex flex-col  overflow-y-scroll">
      {/* Profile */}
      <div className="flex flex-col items-center py-8 px-6">
        <img
          src={selectedFriendDetails?.profilePicture || "/dp.png"}
          alt=""
          className="w-24 h-24 rounded-full object-cover"
        />

        <h2 className="mt-4 text-2xl font-bold">
          {`${selectedFriendDetails?.firstName} ${selectedFriendDetails?.lastName}`}
        </h2>

        <p className="text-gray-500">{selectedFriendDetails?.bio}</p>

        {selectedFriendDetails?.isOnline && (
          <div className="flex items-center gap-2 mt-4 text-green-500 text-sm font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            Online
          </div>
        )}
      </div>

      <hr />

      {/* Shared Media */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <ImageIcon size={16} />
            Shared Media
          </h3>

          <button className="text-violet-600 text-sm hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {media.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className="w-full aspect-square rounded-xl object-cover cursor-pointer hover:scale-105 transition"
            />
          ))}
        </div>
      </div>

      {/* Shared Files */}
      <div className="px-6 pb-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <FileText size={16} />
          Shared Files
        </h3>

        <div className="space-y-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
            >
              <div>
                <h4 className="font-medium">{file.name}</h4>
                <p className="text-sm text-gray-500">{file.size}</p>
              </div>

              <button className="text-violet-600 font-medium hover:underline">
                Open
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
