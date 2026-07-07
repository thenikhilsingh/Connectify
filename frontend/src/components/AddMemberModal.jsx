import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import { LoaderCircle } from "lucide-react";

export default function AddMemberModal({ open, onClose, group, refreshGroup }) {
  const api = useAxios();

  const [friends, setFriends] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    if (!open) return;

    const getFriends = async () => {
      try {
        const response = await api.get("/api/friends");

        setFriends(response.data.friendList);
      } catch (error) {
        console.log(error);
      }
    };

    getFriends();
  }, [open]);

  const availableFriends = friends.filter((friend) => {
    return !group.members.some((member) => member._id === friend._id);
  });

  const handleAddMember = async () => {
    if (!selectedMember) return;
    setAddingMember(true);
    try {
      await api.patch("/api/groups/add-member", {
        groupId: group._id,
        memberId: selectedMember,
      });

      refreshGroup();

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setAddingMember(false);
    }
  };

  if (!open) return null;

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {availableFriends.length === 0 ? (
        <p className="text-gray-500 text-sm">No friends available to add.</p>
      ) : (
        availableFriends.map((friend) => (
          <label
            key={friend._id}
            className="flex items-center gap-3 cursor-pointer border rounded-xl p-3 hover:bg-gray-50"
          >
            <input
              type="radio"
              name="member"
              value={friend._id}
              onChange={(e) => setSelectedMember(e.target.value)}
            />

            <img
              src={friend.profilePicture || "/dp.png"}
              className="w-10 h-10 rounded-full object-cover"
            />

            <span>
              {friend.firstName} {friend.lastName}
            </span>
          </label>
        ))
      )}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border">
          Cancel
        </button>

        <button
          onClick={handleAddMember}
          disabled={addingMember}
          className="px-4 py-2 rounded-xl bg-violet-600 text-white"
        >
          {addingMember ? (
            <>
              <LoaderCircle className="animate-spin" size={18} />
              Adding...
            </>
          ) : (
            "Add"
          )}
        </button>
      </div>
    </div>
  );
}
