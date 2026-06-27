import { useContext, useEffect, useState } from "react";
import {
  MapPin,
  Globe,
  CalendarDays,
  Camera,
  Pencil,
  Heart,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import useAxios from "../hooks/useAxios";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const api = useAxios();
  const { user, setUser } = useContext(AuthContext);
  const [tab, setTab] = useState("Posts");
  const tabs = ["Posts", "Friends"];
  const [editProfile, setEditProfile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const posts = [
    {
      id: 1,
      text: "Just finished the Connectify profile page 🚀",
      image: "https://picsum.photos/900/450?1",
      likes: 142,
      comments: 19,
    },
    {
      id: 2,
      text: "Working on real-time messaging with Socket.io 🔥",
      image: "https://picsum.photos/900/450?2",
      likes: 96,
      comments: 12,
    },
  ];

  const skills = [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Tailwind CSS",
    "Socket.io",
    "Cloudinary",
    "JWT",
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        location: user.location,
      });
    }
  }, [user]);
  const updateProfile = async () => {
    try {
      const data = new FormData();

      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("bio", formData.bio);
      data.append("location", formData.location);

      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      const response = await api.patch("/api/profile", data);
      if (response.status === 200) {
        setUser(response.data.user);
        setEditProfile(false);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [friends, setFriends] = useState([]);
  const getFriends = async () => {
    try {
      const response = await api.get("/api/friends");
      console.log(response.data.friendList);
      setFriends(response.data.friendList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="bg-[#f5f7fb] min-h-screen p-6">
      <div className="max-w-8xl mx-auto">
        <div>
          <div className="relative rounded-3xl overflow-hidden bg-white shadow">
            <div className="relative h-64 overflow-hidden">
              <img
                src={user?.coverImage}
                alt="Cover"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <button
                onClick={() => setEditProfile(true)}
                className="absolute right-6 bottom-6 bg-white px-4 py-2 rounded-xl flex items-center gap-2 shadow"
              >
                <Camera size={18} />
                Change Cover
              </button>
            </div>

            <div className="px-8 pb-8">
              <div className="relative px-8 pb-6">
                <div className="flex justify-between items-end">
                  {/* Left */}
                  <div className="flex items-end gap-6">
                    <div className="relative -mt-20">
                      <img
                        src={user?.profilePicture}
                        className="w-44 h-44 rounded-full border-[5px] border-white object-cover shadow-lg"
                      />

                      <button
                        onClick={() => setEditProfile(true)}
                        className="absolute bottom-2 right-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
                      >
                        <Camera size={18} />
                      </button>
                    </div>

                    <div className="pb-3">
                      <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold">
                          {`${user?.firstName} ${user?.lastName}`}
                        </h1>
                      </div>

                      <p className="text-gray-500 text-lg mt-1">{user?.bio}</p>

                      <div className="flex flex-wrap gap-6 mt-4 text-gray-500">
                        <span className="flex items-center gap-2">
                          <MapPin size={16} />
                          {user?.location}
                        </span>

                        <span className="flex items-center gap-2">
                          <Globe size={16} />
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <button
                    onClick={() => setEditProfile(true)}
                    className="bg-violet-600 hover:bg-violet-700 transition text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow"
                  >
                    <Pencil size={18} />
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="flex gap-8 mt-6 text-gray-700 font-medium">
                <p>
                  <span className="font-bold text-black">24</span> Posts
                </p>

                <p>
                  <span className="font-bold text-black">1.2K</span> Followers
                </p>

                <p>
                  <span className="font-bold text-black">387</span> Following
                </p>

                <p>
                  <span className="font-bold text-black">5.8K</span> Likes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white mt-6 rounded-2xl shadow">
            <div className="flex border-b">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-8 py-5 font-semibold transition ${
                    tab === t
                      ? "text-violet-600 border-b-4 border-violet-600"
                      : "text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "Posts" && (
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-5">
                  <div className="flex gap-4">
                    <img
                      src="https://i.pravatar.cc/200?img=12"
                      className="w-12 h-12 rounded-full"
                    />

                    <input
                      placeholder="What's on your mind?"
                      className="flex-1 rounded-xl border px-4"
                    />

                    <button className="bg-violet-600 text-white px-6 rounded-xl">
                      Post
                    </button>
                  </div>
                </div>

                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border rounded-2xl overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex gap-3 items-center">
                        <img
                          src="https://i.pravatar.cc/200?img=12"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">John Doe</h3>
                          <p className="text-sm text-gray-500">2 hours ago</p>
                        </div>
                      </div>

                      <p className="mt-4">{post.text}</p>
                    </div>

                    <img
                      src={post.image}
                      className="w-full h-96 object-cover"
                    />

                    <div className="flex justify-between p-5 border-t text-gray-600">
                      <span className="flex items-center gap-2">
                        <Heart size={18} /> {post.likes}
                      </span>

                      <span>{post.comments} Comments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "Friends" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Friends
                    </h2>
                    <p className="text-gray-500">{friends?.length} Friends</p>
                  </div>

                  <button className="text-violet-600 font-medium hover:underline">
                    See All
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-5">
                  {friends.map((friend, index) => (
                    <div
                      key={friend._id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer"
                    >
                      <img
                        src={friend?.profilePicture || "/dp.png"}
                        className="w-full h-44 object-cover"
                      />

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800">
                          {`${friend?.firstName} ${friend.lastName}`}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          0 mutual friends
                        </p>

                        <button className="w-full mt-4 bg-violet-100 text-violet-700 py-2 rounded-xl hover:bg-violet-200 transition">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {editProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-8 py-5">
              <h2 className="text-2xl font-bold">Edit Profile</h2>

              <button
                onClick={() => setEditProfile(false)}
                className="text-3xl text-gray-400 hover:text-black"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Cover Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="w-full border rounded-xl p-3 file:bg-violet-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg"
                />
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Profile Picture
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  className="w-full border rounded-xl p-3 file:bg-violet-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg"
                />
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold mb-2">Bio</label>

                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bio: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Tell people about yourself..."
                  className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Location
                </label>

                <input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="India"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 border-t px-8 py-5">
              <button
                onClick={() => setEditProfile(false)}
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={updateProfile}
                className="px-6 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
