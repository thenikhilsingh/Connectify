import React, { useState, useContext } from "react";
import ChatCard from "./ChatCard";
import { AuthContext } from "../context/AuthContext";
import GroupModal from "./GroupModal";

export default function ChatList({
  friends,
  selectedFriend,
  setSelectedFriend,
  groups,
  selectedChat,
  setSelectedChat,
  getGroups,
}) {
  const { onlineUsers } = useContext(AuthContext);
  const [showGroupModal, setShowGroupModal] = useState(false);

  return (
    <div className="bg-white rounded-3xl py-5 flex flex-col gap-3">
      <div className="px-5 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Messages</h1>
        <button
          onClick={() => setShowGroupModal(true)}
          className="bg-violet-600 text-white px-3 py-1 rounded-lg"
        >
          + Group
        </button>
      </div>
      <hr />
      {friends.map((friend) => {
        return (
          <div
            onClick={() => {
              setSelectedFriend(friend._id);

              setSelectedChat({
                type: "friend",
                id: friend._id,
              });
            }}
            key={friend._id}
            className="px-5 cursor-pointer"
          >
            <ChatCard
              name={`${friend.firstName} ${friend.lastName}`}
              avatar={friend?.profilePicture || "/dp.png"}
              online={onlineUsers.includes(friend._id)}
            />
          </div>
        );
      })}
      <hr className="my-4" />
      <h3 className="px-5 text-sm text-gray-500 font-semibold">Groups</h3>
      {groups.map((group) => (
        <div
          key={group._id}
          onClick={() => {
            setSelectedFriend(null);

            setSelectedChat({
              type: "group",
              id: group._id,
            });
          }}
          className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
        >
          <img
            src={group.groupPicture?.url || "/groupDp.png"}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <h4>{group.name}</h4>
            <p className="text-xs text-gray-500">
              {group.members.length} members
            </p>
          </div>
        </div>
      ))}
      {showGroupModal && (
        <GroupModal
          friends={friends}
          getGroups={getGroups}
          setShowGroupModal={setShowGroupModal}
        />
      )}
    </div>
  );
}
