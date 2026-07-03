import { BellOff, FileText, ImageIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthContext } from "../context/AuthContext";
import AddMemberModal from "./AddMemberModal";

dayjs.extend(relativeTime);

export default function ChatInfo({
  selectedFriend,
  selectedFriendDetails,
  selectedChat,
  refreshGroup,
}) {
  const api = useAxios();
  const { onlineUsers, user } = useContext(AuthContext);
  const [media, setMedia] = useState([]);
  const [files, setFiles] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  useEffect(() => {
    if (!selectedChat) return;

    const getShared = async () => {
      try {
        let response;

        if (selectedChat.type === "friend") {
          response = await api.get(`/api/messages/shared/${selectedFriend}`);
        } else {
          response = await api.get(`/api/groups/shared/${selectedChat.id}`);
        }

        setMedia(response.data.media);
        setFiles(response.data.files);
      } catch (error) {
        console.log(error);
      }
    };

    getShared();
  }, [selectedChat]);

  const handleRemoveMember = async (memberId) => {
    try {
      await api.patch("/api/groups/remove-member", {
        groupId: selectedFriendDetails._id,
        memberId,
      });

      refreshGroup();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await api.patch("/api/groups/leave", {
        groupId: selectedFriendDetails._id,
      });

      refreshGroup();
      setSelectedChat({
        type: "friend",
        id: friends[0]._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGroup = async () => {
    const confirmDelete = window.confirm("Delete this group permanently?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/groups/${selectedFriendDetails._id}`);

      refreshGroup();
      setSelectedChat({
        type: "friend",
        id: friends[0]._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-3xl h-full flex flex-col  overflow-y-scroll">
      {/* Profile */}

      {selectedChat?.type === "friend" ? (
        <div className="flex flex-col items-center py-8 px-6">
          <img
            src={selectedFriendDetails?.profilePicture || "/dp.png"}
            className="w-24 h-24 rounded-full object-cover"
          />

          <h2 className="mt-4 text-2xl font-bold">
            {selectedFriendDetails?.firstName} {selectedFriendDetails?.lastName}
          </h2>

          <p className="text-gray-500">{selectedFriendDetails?.bio}</p>

          {onlineUsers.includes(selectedFriend) && (
            <div className="flex items-center gap-2 mt-4 text-green-500 text-sm font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Online
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 px-6">
          <img
            src={selectedFriendDetails?.groupPicture?.url || "/group.png"}
            className="w-24 h-24 rounded-full object-cover"
          />

          <h2 className="mt-4 text-2xl font-bold">
            {selectedFriendDetails?.name}
          </h2>

          <p className="text-gray-500">
            {selectedFriendDetails?.members?.length} members
          </p>
        </div>
      )}

      <hr />
      {selectedChat?.type === "group" && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Members</h3>

            {selectedChat?.type === "group" &&
              selectedFriendDetails?.admin?._id === user._id && (
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="text-violet-600 text-sm hover:underline"
                >
                  + Add
                </button>
              )}
          </div>

          <div className="space-y-4">
            {selectedFriendDetails?.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.profilePicture || "/dp.png"}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>

                    {selectedFriendDetails?.admin?._id === member._id && (
                      <p className="text-xs text-violet-600">Admin</p>
                    )}
                  </div>
                </div>

                {selectedFriendDetails?.admin?._id === user._id &&
                  selectedFriendDetails?.admin?._id !== member._id && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

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
      {/* Group Actions */}
      {selectedChat?.type === "group" && (
        <div className="px-6 pb-6 space-y-3">
          {/* Leave Group - Only Members */}
          {selectedFriendDetails?.admin?._id !== user._id && (
            <button
              onClick={handleLeaveGroup}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition"
            >
              Leave Group
            </button>
          )}

          {/* Delete Group - Only Admin */}
          {selectedFriendDetails?.admin?._id === user._id && (
            <button
              onClick={handleDeleteGroup}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition"
            >
              Delete Group
            </button>
          )}
        </div>
      )}
      <AddMemberModal
        open={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        group={selectedFriendDetails}
        refreshGroup={refreshGroup}
      />
    </div>
  );
}
