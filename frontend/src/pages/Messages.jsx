import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import ChatInfo from "../components/ChatInfo";
import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";

export default function Messages() {
  const api = useAxios();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState();
  const [selectedFriendDetails, setSelectedFriendDetails] = useState({});
  const [groups, setGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const getFriends = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/friends");
      console.log(response.data.friendList);
      setFriends(response.data.friendList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;

    if (selectedChat.type === "friend") {
      const details = friends.find((friend) => friend._id === selectedChat.id);

      setSelectedFriendDetails(details);
    } else {
      const group = groups.find((g) => g._id === selectedChat.id);

      setSelectedFriendDetails(group);
    }
  }, [selectedChat, friends, groups]);

  useEffect(() => {
    if (friends.length > 0 && !selectedChat) {
      setSelectedFriend(friends[0]._id);

      setSelectedChat({
        type: "friend",
        id: friends[0]._id,
      });
    }
  }, [friends]);

  const getGroups = async () => {
    try {
      const response = await api.get("/api/groups");
      setGroups(response.data.groups);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriends();
    getGroups();
  }, []);

  const refreshGroups = async () => {
    const response = await api.get("/api/groups");

    setGroups(response.data.groups);

    if (
      selectedChat?.type === "group" &&
      !response.data.groups.find((g) => g._id === selectedChat.id)
    ) {
      if (response.data.groups.length > 0) {
        setSelectedChat({
          type: "group",
          id: response.data.groups[0]._id,
        });
      } else if (friends.length > 0) {
        setSelectedFriend(friends[0]._id);

        setSelectedChat({
          type: "friend",
          id: friends[0]._id,
        });
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 p-5">
      {/* Left */}
      <div className="w-80">
        <ChatList
          friends={friends}
          groups={groups}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          getGroups={getGroups}
        />
      </div>

      {/* Center */}
      <div className="flex-1">
        <ChatWindow
          selectedFriend={selectedFriend}
          selectedChat={selectedChat}
          selectedFriendDetails={selectedFriendDetails}
        />
      </div>

      {/* Right */}
      <div className="w-80">
        <ChatInfo
          selectedFriend={selectedFriend}
          selectedChat={selectedChat}
          selectedFriendDetails={selectedFriendDetails}
          refreshGroup={refreshGroups}
        />
      </div>
    </div>
  );
}
