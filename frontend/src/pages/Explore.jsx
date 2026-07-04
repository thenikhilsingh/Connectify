import { useState } from "react";
import {
  Search,
  Heart,
  MessageCircle,
  UserPlus,
  Check,
  Clock,
  Send,
} from "lucide-react";
import { useEffect } from "react";
import useAxios from "../hooks/useAxios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Explore() {
  const { user } = useContext(AuthContext);
  const api = useAxios();
  const [tab, setTab] = useState("Posts");
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

  const [posts, setPosts] = useState([]);
  const getPosts = async () => {
    try {
      const response = await api.get("/api/posts");
      console.log(response);
      setPosts(response.data.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const [openComments, setOpenComments] = useState(null);
  const [comment, setComment] = useState("");

  const postComment = async (e, postId) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/posts/comment", {
        postId,
        text: comment,
      });
      if (response.status === 201) {
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const [requests, setRequests] = useState([]);
  const getRequestInfo = async () => {
    try {
      const response = await api.get("/api/people/getRequestInfo");
      setRequests(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPeople();
    getRequestInfo();
  }, []);

  const renderButton = (request, id) => {
    if (!request) {
      return (
        <button
          onClick={() => sendRequest(id)}
          className="mt-4 w-full bg-violet-600 text-white rounded-xl py-2 flex justify-center gap-2"
        >
          <UserPlus size={18} />
          Add Friend
        </button>
      );
    }

    if (request.status === "accepted") {
      return (
        <button className="mt-4 w-full bg-green-100 text-green-700 rounded-xl py-2 flex justify-center gap-2">
          <Check size={18} />
          Friends
        </button>
      );
    }

    if (request.status === "pending") {
      // Logged-in user sent the request
      if (request.role === "sender") {
        return (
          <button className="mt-4 w-full bg-yellow-100 text-yellow-700 rounded-xl py-2 flex justify-center gap-2">
            <Clock size={18} />
            Request Sent
          </button>
        );
      }

      if (request.status === "rejected") {
        return (
          <button
            onClick={() => sendRequest(id)}
            className="mt-4 w-full bg-violet-600 text-white rounded-xl py-2 flex justify-center gap-2"
          >
            <UserPlus size={18} />
            Add Friend
          </button>
        );
      }

      // Logged-in user received the request
      return (
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-green-500 text-white rounded-xl py-2">
            Accept
          </button>

          <button className="flex-1 bg-red-500 text-white rounded-xl py-2">
            Decline
          </button>
        </div>
      );
    }
  };

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
            {posts.map((post) => (
              <div
                key={post?._id}
                className="border rounded-2xl overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex gap-3 items-center">
                    <img
                      src={post?.createdBy?.profilePicture || "/dp.png"}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{`${post?.createdBy?.firstName} ${post?.createdBy?.lastName}`}</h3>
                      <p className="text-sm text-gray-500">
                        {dayjs(post?.createdAt)?.fromNow()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4">{post?.caption}</p>
                </div>
                {post?.file?.type?.startsWith("image") ? (
                  <img
                    src={post.file.url}
                    alt="Post"
                    className="w-full  mt-4 object-cover max-h-125"
                  />
                ) : post?.file?.type?.startsWith("video") ? (
                  <video
                    src={post.file.url}
                    controls
                    className="w-full  mt-4 max-h-125"
                  />
                ) : null}
                <div className="mt-5 flex justify-between text-sm text-gray-500 px-5">
                  <span>❤️ {post?.likes.length} Likes</span>
                  <span>💬 {post?.comments.length} Comments</span>
                </div>

                <div className="mt-4 border-t pt-3 px-5">
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition font-medium">
                      <Heart size={20} />
                      Like
                    </button>

                    <button
                      onClick={() =>
                        setOpenComments(
                          openComments === post._id ? null : post._id,
                        )
                      }
                      className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-violet-50 hover:text-violet-600 transition font-medium"
                    >
                      <MessageCircle size={20} />
                      Comment
                    </button>
                  </div>

                  {/* Comments */}
                  {openComments === post._id && (
                    <div className="mt-5 space-y-4 border-t pt-5">
                      {post.comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3">
                          <img
                            src={comment.author?.profilePicture || "/dp.png"}
                            className="w-10 h-10 rounded-full object-cover"
                          />

                          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">
                                {comment.author?.firstName}{" "}
                                {comment.author?.lastName}
                              </h4>

                              <span className="text-xs text-gray-500">
                                {dayjs(comment.createdAt).fromNow()}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-700">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      <form
                        onSubmit={(e) => postComment(e, post?._id)}
                        className="flex gap-3"
                      >
                        <img
                          src={user?.profilePicture || "/dp.png"}
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-1 rounded-full border border-gray-300 px-4 py-2 outline-none focus:border-violet-500"
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />

                          <button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-700 text-white rounded-full w-11 h-11 flex items-center justify-center"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "People" && (
          <div className="grid grid-cols-3 gap-6 mt-8">
            {people
              .filter((person) => person._id !== user?._id)
              .filter((person) => person.email !== "guest@gmail.com")
              .map((person) => {
                const request = requests.find(
                  (req) =>
                    req.sender._id === person._id ||
                    req.reciever._id === person._id,
                );
                return (
                  <div
                    key={person._id}
                    className="border rounded-2xl p-5 hover:shadow-lg"
                  >
                    <img
                      src={person?.profilePicture || "/dp.png"}
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                    <h3 className="text-center text-xl font-semibold mt-4">
                      {`${person?.firstName} ${person?.lastName}`}
                    </h3>
                    <p className="text-center text-gray-500">{person?.bio}</p>
                    <p className="text-center text-sm text-gray-400 mt-2">
                      0 mutual friends
                    </p>
                    {renderButton(request, person._id)}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
