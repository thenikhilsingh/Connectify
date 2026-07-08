import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Globe,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useAxios from "../hooks/useAxios";
import { AuthContext } from "../context/AuthContext";
dayjs.extend(relativeTime);

export default function UserProfile() {
  const api = useAxios();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendStatus, setFriendStatus] = useState("none");
  const [tab, setTab] = useState("Posts");
  const [requestLoading, setRequestLoading] = useState(false);
  const [likingId, setLikingId] = useState(null);
  const [commentingId, setCommentingId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [openComments, setOpenComments] = useState(null);
  const [comment, setComment] = useState("");

  const loadProfile = async () => {
    try {
      const res = await api.get(`/api/profile/${id}`);
      setUser(res.data.user);
      setPosts(res.data.posts);
      setFriends(res.data.friends || []);
      setFriendStatus(res.data.friendStatus);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser?._id === id) {
      navigate("/app/profile");
      return;
    }

    loadProfile();
  }, [id, currentUser, navigate]);

  const handleSendFriendRequest = async () => {
    setRequestLoading(true);
    try {
      const response = await api.post(`/api/people/sendFriendRequest/${id}`);
      if (response.status === 200) {
        await loadProfile();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleLike = async (postId) => {
    setLikingId(postId);
    try {
      const response = await api.patch("/api/posts/like", {
        postId,
      });
      if (response.status === 200) {
        await loadProfile();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLikingId(null);
    }
  };

  const postComment = async (e, postId) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentingId(postId);
    try {
      const response = await api.post("/api/posts/comment", {
        postId,
        text: comment,
      });
      if (response.status === 201) {
        await loadProfile();
        setComment("");
        setOpenComments(postId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCommentingId(null);
    }
  };

  const deleteComment = async (commentId) => {
    setDeletingCommentId(commentId);
    try {
      const response = await api.delete(
        `/api/posts/comment/delete/${commentId}`,
      );
      if (response.status === 200) {
        await loadProfile();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleMessage = () => {
    navigate("/app/messages");
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen p-6">
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <img
          src={user.coverImage || "/cover.png"}
          className="h-64 w-full object-cover"
        />
        <div className="px-8 pb-8">
          <div className="flex justify-between items-end">
            <div className="flex items-end gap-6">
              <img
                src={user.profilePicture || "/dp.png"}
                className="w-44 h-44 rounded-full border-[5px] border-white -mt-20 object-cover"
              />
              <div>
                <h1 className="text-4xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-500">{user.bio}</p>
                <div className="flex gap-6 mt-3 text-gray-500">
                  <span className="flex gap-2 items-center">
                    <MapPin size={16} />
                    {user.location}
                  </span>
                  <span className="flex gap-2 items-center">
                    <Globe size={16} />
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleMessage}
                className="bg-violet-600 text-white px-6 py-3 rounded-xl"
              >
                Message
              </button>
              {friendStatus === "accepted" && (
                <button className="bg-gray-100 px-6 py-3 rounded-xl">
                  Friends
                </button>
              )}
              {friendStatus === "pending" && (
                <button className="bg-yellow-100 px-6 py-3 rounded-xl">
                  Request Sent
                </button>
              )}
              {friendStatus === "none" && (
                <button
                  onClick={handleSendFriendRequest}
                  disabled={requestLoading}
                  className="bg-violet-100 text-violet-700 px-6 py-3 rounded-xl"
                >
                  {requestLoading ? "Sending..." : "Add Friend"}
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-8 mt-6">
            <p>
              <b>{posts.length}</b> Posts
            </p>
            <p>
              <b>{friends.length}</b> Friends
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white mt-6 rounded-2xl shadow">
        <div className="flex border-b">
          {["Posts", "Friends"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-8 py-5 ${tab === t ? "border-b-4 border-violet-600 text-violet-600" : "text-gray-500"}`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Posts" && (
          <div className="p-6 space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border rounded-2xl overflow-hidden"
              >
                <div className="p-5">
                  <h3 className="font-semibold">
                    {post.createdBy?.firstName} {post.createdBy?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {dayjs(post.createdAt).fromNow()}
                  </p>
                  <p className="mt-4">{post.caption}</p>
                </div>
                {post.file?.type?.startsWith("image") && (
                  <img
                    src={post.file.url}
                    className="w-full max-h-125 object-cover"
                  />
                )}
                {post.file?.type?.startsWith("video") && (
                  <video
                    controls
                    src={post.file.url}
                    className="w-full max-h-125"
                  />
                )}
                <div className="flex justify-around py-4 border-t">
                  <button
                    type="button"
                    onClick={() => handleLike(post._id)}
                    disabled={likingId === post._id}
                    className={`flex items-center gap-2 py-3 rounded-xl transition font-medium ${post.likes?.includes(currentUser?._id) ? "text-red-500 hover:bg-red-50" : "hover:bg-violet-50 hover:text-violet-600"}`}
                  >
                    {likingId === post._id ? (
                      <span className="text-sm">Loading...</span>
                    ) : post.likes?.includes(currentUser?._id) ? (
                      <Heart fill="red" size={18} />
                    ) : (
                      <Heart size={18} />
                    )}
                    Like ({post.likes?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenComments(
                        openComments === post._id ? null : post._id,
                      )
                    }
                    className="flex items-center gap-2 py-3 rounded-xl hover:bg-violet-50 hover:text-violet-600 transition font-medium"
                  >
                    <MessageCircle size={18} />
                    Comment ({post.comments?.length || 0})
                  </button>
                </div>
                {openComments === post._id && (
                  <div className="border-t p-5 space-y-4">
                    {post.comments?.length > 0 ? (
                      post.comments.map((commentItem) => (
                        <div
                          key={commentItem._id}
                          className="rounded-2xl bg-gray-100 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold text-sm">
                              {commentItem.author?.firstName}{" "}
                              {commentItem.author?.lastName}
                            </div>
                            <div className="flex items-center gap-2">
                              {commentItem.author?._id === currentUser?._id && (
                                <button
                                  type="button"
                                  disabled={
                                    deletingCommentId === commentItem._id
                                  }
                                  onClick={() => deleteComment(commentItem._id)}
                                  className="text-red-500"
                                >
                                  {deletingCommentId === commentItem._id ? (
                                    <LoaderCircle
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2 size={18} />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-gray-600 text-sm mt-1">
                            {commentItem.text}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No comments yet. Be the first to comment.
                      </p>
                    )}
                    <form
                      onSubmit={(e) => postComment(e, post._id)}
                      className="flex gap-3"
                    >
                      <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 rounded-2xl border border-gray-200 px-4 py-3"
                      />
                      <button
                        type="submit"
                        disabled={commentingId === post._id || !comment.trim()}
                        className="rounded-2xl bg-violet-600 px-5 py-3 text-white disabled:opacity-60"
                      >
                        {commentingId === post._id ? "Posting..." : "Post"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {tab === "Friends" && (
          <div className="grid grid-cols-4 gap-5 p-6">
            {friends.map((f) => (
              <div key={f._id} className="border rounded-2xl overflow-hidden">
                <img
                  src={f.profilePicture || "/dp.png"}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4 space-y-3">
                  <h3>
                    {f.firstName} {f.lastName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate(`/app/profile/${f._id}`)}
                    className="w-full bg-violet-600 text-white rounded-xl py-3 hover:bg-violet-700 transition"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
