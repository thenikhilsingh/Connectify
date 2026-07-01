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
    getFriends();
  }, []);

  useEffect(() => {
    if (!selectedFriend) return;

    const details = friends.find((friend) => friend._id === selectedFriend);
    console.log(details);
    setSelectedFriendDetails(details);
  }, [selectedFriend, friends]);

  useEffect(() => {
    if (friends.length > 0 && !selectedFriend) {
      setSelectedFriend(friends[0]._id);
    }
  }, [friends, selectedFriend]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 p-5">
      {/* Left */}
      <div className="w-80">
        <ChatList
          friends={friends}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
        />
      </div>

      {/* Center */}
      <div className="flex-1">
        <ChatWindow
          selectedFriend={selectedFriend}
          selectedFriendDetails={selectedFriendDetails}
        />
      </div>

      {/* Right */}
      <div className="w-80">
        <ChatInfo
          selectedFriend={selectedFriend}
          selectedFriendDetails={selectedFriendDetails}
        />
      </div>
    </div>
  );
}
