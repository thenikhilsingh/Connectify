import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Image,
  Smile,
  SendHorizontal,
  MessageCircle,
  Flame,
} from "lucide-react";

export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6 p-6">
      {/* Feed */}
      <div className="space-y-6">
        {/* Create Post */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <img
              src="https://i.pravatar.cc/150?img=12"
              className="w-12 h-12 rounded-full object-cover"
            />

            <textarea
              rows={4}
              placeholder="What's on your mind, Nikhil?"
              className="flex-1 resize-none rounded-2xl bg-gray-50 p-4 outline-none border border-gray-200 focus:border-violet-500"
            />
          </div>

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer rounded-xl px-4 py-2 hover:bg-violet-50 transition">
              <Image size={20} className="text-violet-600" />
              <span>Media</span>

              <input type="file" className="hidden" />
            </label>

            <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl font-medium transition">
              Post
            </button>
          </div>
        </div>
        {/* Demo Feed */}
        {[1, 2, 3].map((post) => (
          <div
            key={post}
            className="rounded-3xl bg-white shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center gap-3">
              <img
                src={`https://i.pravatar.cc/150?img=${post + 10}`}
                alt=""
                className="h-12 w-12 rounded-full"
              />

              <div>
                <h3 className="font-semibold">Rahul Sharma</h3>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>

            <p className="mt-4 text-gray-700">
              Just finished building my social media app using the MERN stack.
              🚀
            </p>

            <div className="mt-5 rounded-2xl bg-gray-100 h-64"></div>

            <div className="mt-5 flex justify-between text-sm text-gray-500">
              <span>❤️ 145 Likes</span>
              <span>💬 26 Comments</span>
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
