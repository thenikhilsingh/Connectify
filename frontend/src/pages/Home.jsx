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
} from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const api = useAxios();
  const [formData, setFormData] = useState({
    caption: "",
    file: "",
  });
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
        console.log("Post created!", response.data);

        setFormData({
          caption: "",
          file: null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              src="https://i.pravatar.cc/150?img=12"
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

            <div className="mt-4 flex justify-between border-t pt-4">
              <button className="py-2 rounded-xl hover:bg-gray-100 transition">
                Like
              </button>

              <button className="py-2 rounded-xl hover:bg-gray-100 transition">
                Comment
              </button>
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
