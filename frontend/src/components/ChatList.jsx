import React from "react";
import ChatCard from "./ChatCard";

export default function ChatList() {
  return (
    <div className="bg-white rounded-3xl py-5 flex flex-col gap-3">
      <div className="px-5">
        <h1 className="font-bold text-2xl">Messages</h1>
      </div>
      <hr />
      <div className="px-5">
        <ChatCard
          name="Emma Watson"
          message="See you tomorrow 🙂"
          avatar="https://i.pravatar.cc/100?img=5"
          online={true}
          time="2m"
          unread={2}
        />
      </div>
    </div>
  );
}
