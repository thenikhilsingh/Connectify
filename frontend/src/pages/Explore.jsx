import { useState } from "react";
import {
  Search,
  Heart,
  MessageCircle,
  UserPlus,
  Check,
  Clock,
} from "lucide-react";
import { useEffect } from "react";
import useAxios from "../hooks/useAxios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Explore() {
  const { user } = useContext(AuthContext);
  const api = useAxios();
  const [tab, setTab] = useState("Posts");
  const posts = [
    {
      id: 1,
      name: "Emma Watson",
      time: "2 hrs ago",
      text: "Enjoying the mountains 🌄",
      image: "https://picsum.photos/800/450?1",
      likes: 234,
      comments: 19,
    },
    {
      id: 2,
      name: "Noah Brown",
      time: "5 hrs ago",
      text: "Late night coding ☕",
      image: "https://picsum.photos/800/450?2",
      likes: 143,
      comments: 8,
    },
  ];
  const [people, setPeople] = useState([]);

  const getPeople = async () => {
    try {
      const response = await api.get("/api/people");
      console.log(response.data.people);
      setPeople(response.data.people);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPeople();
  }, []);

  const sendRequest = async (id) => {
    try {
      const response = await api.post(`/api/people/sendFriendRequest/${id}`);
      console.log(response);
      if (response.status === 200) {
        getPeople();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [friendRequestStatus, setFriendRequestStatus] = useState("");
  const getRequestInfo = async (id) => {
    try {
      const response = await api.get(`/api/people/getRequestInfo/${id}`);
      setFriendRequestStatus(response.data.requestDetail.status);
    } catch (error) {
      console.log(error);
    }
  };

  const renderButton = (s, id) =>
    s === "accepted" ? (
      <button className="mt-4 w-full bg-green-100 text-green-700 rounded-xl py-2 flex justify-center gap-2">
        <Check size={18} />
        Friends
      </button>
    ) : s === "pending" ? (
      <button className="mt-4 w-full bg-yellow-100 text-yellow-700 rounded-xl py-2 flex justify-center gap-2">
        <Clock size={18} />
        Request Sent
      </button>
    ) : (
      <button
        onClick={() => sendRequest(id)}
        className="mt-4 w-full bg-violet-600 text-white rounded-xl py-2 flex justify-center gap-2"
      >
        <UserPlus size={18} />
        Add Friend
      </button>
    );
  return (
    <div className="bg-[#f5f7fb] min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Explore</h1>
          <div className="relative w-105">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />
            <input
              className="w-full border rounded-xl pl-11 py-3 pr-4"
              placeholder="Search posts or people..."
            />
          </div>
        </div>
        <div className="flex gap-8 mt-8 border-b">
          {["Posts", "People"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                tab === t
                  ? "pb-4 font-semibold text-violet-600 border-b-4 border-violet-600"
                  : "pb-4 font-semibold text-gray-500"
              }
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Posts" && (
          <div className="space-y-6 mt-8">
            {posts.map((p) => (
              <div key={p.id} className="border rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex gap-3 items-center">
                    <img
                      src={`https://i.pravatar.cc/100?img=${p.id + 10}`}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.time}</p>
                    </div>
                  </div>
                  <p className="mt-4">{p.text}</p>
                </div>
                <img src={p.image} className="w-full h-96 object-cover" />
                <div className="flex justify-between p-5 border-t">
                  <button className="flex gap-2">
                    <Heart size={18} />
                    {p.likes}
                  </button>
                  <button className="flex gap-2">
                    <MessageCircle size={18} />
                    {p.comments}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "People" && (
          <div className="grid grid-cols-3 gap-6 mt-8">
            {people
              .filter((person) => person._id !== user._id)
              .filter((person) => person.email !== "guest@gmail.com")
              .map((person) => {
                getRequestInfo(person._id);
                return (
                  <div
                    key={person._id}
                    className="border rounded-2xl p-5 hover:shadow-lg"
                  >
                    <img
                      src={person?.profilePicture}
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                    <h3 className="text-center text-xl font-semibold mt-4">
                      {`${person?.firstName} ${person?.lastName}`}
                    </h3>
                    <p className="text-center text-gray-500">{person?.bio}</p>
                    <p className="text-center text-sm text-gray-400 mt-2">
                      0 mutual friends
                    </p>
                    {renderButton(friendRequestStatus, person._id)}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
