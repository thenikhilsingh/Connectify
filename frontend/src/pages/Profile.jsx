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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await api.get("/api/posts/user");
      console.log(response);
      setPosts(response.data.post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

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

  const [payload, setPayload] = useState({
    caption: "",
    file: "",
  });

  const handleChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("caption", payload.caption);
      if (payload.file) {
        data.append("media", payload.file);
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
                  <span className="font-bold text-black">{posts.length}</span>{" "}
                  Posts
                </p>

                <p>
                  <span className="font-bold text-black">{friends.length}</span>{" "}
                  Friends
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
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex gap-4">
                    <img
                      src={user?.profilePicture || "/dp.png"}
                      className="w-12 h-12 rounded-full object-cover"
                      alt=""
                    />

                    <form onSubmit={handleSubmit} className="flex-1">
                      <textarea
                        rows={3}
                        placeholder="What's on your mind?"
                        className="w-full resize-none rounded-2xl bg-gray-50 border border-gray-200 p-4 outline-none focus:border-violet-500"
                        name="caption"
                        value={payload.caption}
                        onChange={handleChange}
                      />

                      {/* Media Preview */}
                      {payload.file && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200">
                          {payload.file.type.startsWith("image") ? (
                            <img
                              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200"
                              alt=""
                              className="w-full h-80 object-cover"
                            />
                          ) : (
                            <video
                              controls
                              className="w-full h-80 object-cover"
                            >
                              <source src="" />
                            </video>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <label className="cursor-pointer flex items-center gap-2 rounded-xl px-4 py-2 hover:bg-violet-50 transition text-violet-600 font-medium">
                          <ImageIcon size={20} />
                          <span>Add Media</span>

                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) =>
                              setPayload({
                                ...payload,
                                file: e.target.files[0],
                              })
                            }
                            className="hidden"
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
                  </div>
                </div>

                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white border rounded-2xl overflow-hidden"
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

                    <div className="flex justify-between p-5 border-t text-gray-600">
                      <span className="flex items-center gap-2">
                        <Heart size={18} /> {post?.likes.length}
                      </span>

                      <span>{post?.comments.length} Comments</span>
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
