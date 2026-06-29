import React from "react";
import ChatCard from "./ChatCard";

export default function ChatList({ friends, setSelectedFriend }) {
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
              message="See you tomorrow 🙂"
              avatar={friend?.profilePicture || "/dp.png"}
              online={friend?.isOnline}
              time={friend?.lastSeen}
              unread={2}
            />
          </div>
        );
      })}
    </div>
  );
}
