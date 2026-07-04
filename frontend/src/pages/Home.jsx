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
} from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Home() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const api = useAxios();
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
    }
  };

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
        getPosts();
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              src={user?.profilePicture}
              className="w-12 h-12 rounded-full object-cover"
            />

            <textarea
              rows={4}
              placeholder="What's on your mind, Nikhil?"
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
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl font-medium transition"
            >
              Post
            </button>
          </div>
        </form>
        {/* Demo Feed */}
        {posts.map((post) => (
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
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition font-medium">
                  <Heart size={20} />
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
              </div>

              {/* Comments */}
              {openComments === post._id && (
                <div className="mt-5 space-y-4 border-t pt-5">
                  {/* Single Comment */}
                  {post?.comments.map((comment) => {
                    return (
                      <div className="flex gap-3">
                        <img
                          src={comment?.author.profilePicture || "/dp.png"}
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">
                              {`${comment.author.firstName} ${comment.author.lastName}`}
                            </h4>

                            <span className="text-xs text-gray-500">
                              {dayjs(comment?.createdAt)?.fromNow()}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-gray-700">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}

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

      {/* Right Sidebar */}
      <div className="space-y-5 sticky h-fit">
        {/* Online Friends */}
        <div className="rounded-3xl bg-white shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-lg mb-5">🟢 Online Friends</h2>

          <div className="space-y-4">
            {["Rahul", "Aman", "Priya", "Karan", "Ankit"].map((user, index) => (
              <div key={user} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={`https://i.pravatar.cc/100?img=${index + 30}`}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />

                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  </div>

                  <span className="font-medium">{user}</span>
                </div>

                <button className="text-violet-600 hover:text-violet-800">
                  <MessageCircle size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
