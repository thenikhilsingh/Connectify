import { useState } from "react";
import useAxios from "../hooks/useAxios";

export default function GroupModal({ friends, getGroups, setShowGroupModal }) {
  const api = useAxios();

  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);

  const toggleMember = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers((prev) => prev.filter((member) => member !== id));
    } else {
      setSelectedMembers((prev) => [...prev, id]);
    }
  };

  const createGroup = async () => {
    try {
      const formData = new FormData();

      formData.append("name", groupName);

      selectedMembers.forEach((member) => {
        formData.append("members", member);
      });

      if (groupImage) {
        formData.append("groupPicture", groupImage);
      }

      await api.post("/api/groups", formData);

      getGroups();
      setShowGroupModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-112.5">
        <h2 className="text-2xl font-bold mb-5">Create Group</h2>
        <input type="file" onChange={(e) => setGroupImage(e.target.files[0])} />
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border rounded-lg p-3 mb-5"
        />

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {friends.map((friend) => (
            <label
              key={friend._id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedMembers.includes(friend._id)}
                onChange={() => toggleMember(friend._id)}
              />

              <img
                src={friend.profilePicture || "/dp.png"}
                className="w-10 h-10 rounded-full object-cover"
              />

              <span>
                {friend.firstName} {friend.lastName}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowGroupModal(false)}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={createGroup}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
