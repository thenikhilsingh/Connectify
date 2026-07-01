import React, { useContext } from "react";
import ChatCard from "./ChatCard";
import { AuthContext } from "../context/AuthContext";

export default function ChatList({
  friends,
  selectedFriend,
  setSelectedFriend,
}) {
  const { onlineUsers } = useContext(AuthContext);
  const isOnline = onlineUsers.includes(selectedFriend);
  return (
    <div className="bg-white rounded-3xl py-5 flex flex-col gap-3">
      <div className="px-5">
        <h1 className="font-bold text-2xl">Messages</h1>
      </div>
      <hr />
      {friends.map((friend) => {
        return (
          <div
            onClick={() => setSelectedFriend(friend._id)}
            key={friend._id}
            className="px-5 cursor-pointer"
          >
            <ChatCard
              name={`${friend.firstName} ${friend.lastName}`}
              avatar={friend?.profilePicture || "/dp.png"}
              online={isOnline}
            />
          </div>
        );
      })}
    </div>
  );
}
