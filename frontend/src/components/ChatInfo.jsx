import { BellOff, FileText, ImageIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthContext } from "../context/AuthContext";

dayjs.extend(relativeTime);

export default function ChatInfo({ selectedFriend, selectedFriendDetails }) {
  const api = useAxios();
  const { onlineUsers } = useContext(AuthContext);
  const [media, setMedia] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!selectedFriend) return;

    const getShared = async () => {
      const response = await api.get(`/api/messages/shared/${selectedFriend}`);
      console.log(response);
      setMedia(response.data.media);
      setFiles(response.data.files);
    };

    getShared();
  }, [selectedFriend]);
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

        {onlineUsers.includes(selectedFriend) && (
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
          {media.map((item) => (
            <img
              key={item._id}
              src={item.file.url}
              alt=""
              className="w-full aspect-square rounded-xl object-cover"
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
          {files.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <FileText size={22} className="text-violet-600" />

                <div>
                  <h4 className="font-medium text-sm">
                    {item.file.originalName}
                  </h4>

                  <p className="text-xs text-gray-500">
                    {dayjs(item.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
