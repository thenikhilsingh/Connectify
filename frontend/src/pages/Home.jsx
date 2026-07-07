import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import {
  Image,
  Smile,
  SendHorizontal,
  MessageCircle,
  Flame,
  Heart,
  Send,
  Trash2,
  LoaderCircle,
  CalendarDays,
  CloudSun,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
dayjs.extend(relativeTime);

export default function Home() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const api = useAxios();
  const [posting, setPosting] = useState(false);
  const [likingId, setLikingId] = useState(null);
  const [commentingId, setCommentingId] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [formData, setFormData] = useState({
    caption: "",
    file: "",
  });

  const [posts, setPosts] = useState([]);
  const getPosts = async () => {
    try {
      const response = await api.get("/api/posts/feed");
      console.log(response);
      setPosts(response.data.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);

    try {
      const data = new FormData();

      data.append("caption", formData.caption);

      if (formData.file) {
        data.append("media", formData.file);
      }

      const response = await api.post("/api/posts/create", data);

      if (response.status === 201) {
        getPosts();

        setFormData({
          caption: "",
          file: null,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPosting(false);
    }
  };

  const [openComments, setOpenComments] = useState(null);
  const [comment, setComment] = useState("");

  const postComment = async (e, postId) => {
    e.preventDefault();
    setCommentingId(postId);
    try {
      const response = await api.post("/api/posts/comment", {
        postId,
        text: comment,
      });
      if (response.status === 201) {
        getPosts();
        setComment("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCommentingId(null);
    }
  };

  const handleLike = async (postId) => {
    setLikingId(postId);
    try {
      const response = await api.patch("/api/posts/like", {
        postId: postId,
      });
      if (response.status === 200) {
        getPosts();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLikingId(null);
    }
  };

  const handleDeletePost = async (id) => {
    setDeletingPostId(id);
    try {
      const response = await api.delete(`/api/posts/delete/${id}`);
      if (response.status === 200) {
        getPosts();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingPostId(null);
    }
  };

  const deleteComment = async (commentId) => {
    setDeletingCommentId(commentId);

    try {
      const response = await api.delete(
        `/api/posts/comment/delete/${commentId}`,
      );
      if (response.status === 200) {
        getPosts();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const [weather, setWeather] = useState(null);

  const getWeather = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`,
      );

      setWeather(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        getWeather(latitude, longitude);
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const getQuote = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/quotes/random");

        setQuote(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getQuote();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6 p-6">
      {/* Feed */}
      <div className="space-y-6">
        {/* Create Post */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-md border border-gray-100 p-6"
        >
          <div className="flex items-start gap-4">
            <img
              src={user?.profilePicture || "/dp.png"}
              className="w-12 h-12 rounded-full object-cover"
            />

            <textarea
              rows={4}
              placeholder={`What's on your mind, ${user?.firstName || "User"}?`}
              className="flex-1 resize-none rounded-2xl bg-gray-50 p-4 outline-none border border-gray-200 focus:border-violet-500"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
            />
          </div>
          {formData.file && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200">
              {formData.file.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(formData.file)}
                  alt="Preview"
                  className="w-full max-h-96 object-cover"
                />
              ) : (
                <video
                  src={URL.createObjectURL(formData.file)}
                  controls
                  className="w-full max-h-96"
                />
              )}
            </div>
          )}
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 hover:bg-violet-50 transition">
              <Image size={20} className="text-violet-600" />
              <span>Media</span>

              <input
                type="file"
                className="hidden"
                name="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    file: e.target.files[0],
                  })
                }
              />
            </label>

            <button
              type="submit"
              disabled={posting || user?.isGuest}
              className={
                user?.isGuest
                  ? "cursor-not-allowed bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl font-medium transition"
                  : "bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl font-medium transition"
              }
            >
              {posting && <LoaderCircle size={18} className="animate-spin" />}
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
        {/* Demo Feed */}
        {posts?.map((post) => (
          <div
            key={post?._id}
            className="rounded-3xl bg-white shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center gap-3">
              <img
                src={post?.createdBy?.profilePicture || "/dp.png"}
                alt=""
                className="h-12 w-12 rounded-full"
              />

              <div>
                <h3 className="font-semibold">{`${post?.createdBy?.firstName} ${post?.createdBy?.lastName}`}</h3>
                <p className="text-sm text-gray-500">
                  {dayjs(post?.createdAt)?.fromNow()}
                </p>
              </div>
            </div>

            <p className="mt-4 text-gray-700">{post?.caption}</p>

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

            <div className="mt-5 flex justify-between text-sm text-gray-500">
              <span>❤️ {post?.likes.length} Likes</span>
              <span>💬 {post?.comments.length} Comments</span>
            </div>

            <div className="mt-4 border-t pt-3">
              <div
                className={
                  post?.createdBy._id === user._id
                    ? "grid grid-cols-3 gap-3"
                    : "grid grid-cols-2 gap-3"
                }
              >
                <button
                  type="button"
                  onClick={() => handleLike(post._id)}
                  disabled={likingId === post._id}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition font-medium"
                >
                  {likingId === post._id ? (
                    <LoaderCircle className="animate-spin" size={18} />
                  ) : post.likes.includes(user._id) ? (
                    <Heart fill="red" size={20} />
                  ) : (
                    <Heart size={20} />
                  )}
                  Like
                </button>

                <button
                  onClick={() =>
                    setOpenComments(openComments === post._id ? null : post._id)
                  }
                  className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-violet-50 hover:text-violet-600 transition font-medium"
                >
                  <MessageCircle size={20} />
                  Comment
                </button>
                {post?.createdBy._id === user._id && (
                  <button
                    disabled={deletingPostId === post._id}
                    onClick={() => handleDeletePost(post?._id)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-violet-50 hover:text-violet-600 transition font-medium"
                  >
                    {deletingPostId === post._id ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={20} />
                        Delete
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Comments */}
              {openComments === post?._id && (
                <div className="mt-5 space-y-4 border-t pt-5">
                  {/* Single Comment */}
                  {post?.comments.map((comment) => {
                    return (
                      <div className="flex gap-3">
                        <img
                          src={comment?.author?.profilePicture || "/dp.png"}
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">
                              {`${comment?.author?.firstName || ""} ${comment?.author?.lastName || ""}`}
                            </h4>

                            <div className="flex gap-2">
                              <span className="text-xs text-gray-500">
                                {dayjs(comment?.createdAt)?.fromNow()}
                              </span>
                              {comment?.author?._id === user?._id && (
                                <button
                                  disabled={deletingCommentId === comment._id}
                                  onClick={() => deleteComment(comment._id)}
                                >
                                  {deletingCommentId === comment._id ? (
                                    <LoaderCircle
                                      size={16}
                                      className="animate-spin text-red-500"
                                    />
                                  ) : (
                                    <Trash2 size={18} color="red" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="mt-1 text-sm text-gray-700">
                            {comment?.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Comment */}
                  <form
                    onSubmit={(e) => postComment(e, post._id)}
                    className="flex gap-3"
                  >
                    <img
                      src={user?.profilePicture || "/dp.png"}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1 flex gap-2">
                      <input
                        placeholder="Write a comment..."
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 outline-none focus:border-violet-500"
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />

                      <button
                        type="submit"
                        disabled={commentingId === post._id}
                        className="bg-violet-600 hover:bg-violet-700 text-white rounded-full w-11 h-11 flex items-center justify-center"
                      >
                        {commentingId === post._id ? (
                          <LoaderCircle
                            size={18}
                            className="animate-spin text-white"
                          />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-5 sticky top-5 h-fit">
        {/* Today's Date */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <CalendarDays className="text-violet-600" />
            <h2 className="font-semibold text-lg">Today</h2>
          </div>

          <h3 className="text-xl font-bold">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>

          <p className="text-3xl font-bold text-violet-600 mt-3">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Weather */}
        {weather && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CloudSun className="text-yellow-500" />
                  <h2 className="font-semibold text-lg">Weather</h2>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  📍 {weather?.name}, {weather?.sys?.country}
                </p>

                <h1 className="text-5xl font-bold mt-3">
                  {Math.round(weather?.main?.temp)}°
                </h1>

                <p className="text-gray-500 capitalize">
                  {weather?.weather?.[0]?.description}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Feels like {Math.round(weather?.main?.feels_like)}°
                </p>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${weather?.weather?.[0]?.icon}@2x.png`}
                alt="Weather"
              />
            </div>
          </div>
        )}

        {/* Quote */}
        <div className="bg-linear-to-br from-violet-600 to-purple-500 rounded-3xl text-white p-6">
          <h3 className="font-semibold mb-3">💡 Today's Motivation</h3>

          <p>"{quote?.quote}"</p>
          <p>- {quote?.author}</p>
        </div>
      </div>
    </div>
  );
}
