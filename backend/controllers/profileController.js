const User = require("../models/user");
const { uploadOnCloudinary, cloudinary } = require("../utils/cloudinary");
const Post = require("../models/post");
const Friend = require("../models/friend");

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, location } = req.body;

    const user = await User.findById(req.user._id);

    // Get uploaded file paths
    const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // Upload images to Cloudinary
    let uploadedProfile;
    let uploadedCover;

    if (profilePictureLocalPath) {
      uploadedProfile = await uploadOnCloudinary(profilePictureLocalPath);

      if (!uploadedProfile) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload profile picture",
        });
      }

      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }
    }

    if (coverImageLocalPath) {
      uploadedCover = await uploadOnCloudinary(coverImageLocalPath);

      if (!uploadedCover) {
        return res.status(400).json({
          success: false,
          message: "Failed to upload cover image",
        });
      }

      if (user.coverImagePublicId) {
        await cloudinary.uploader.destroy(user.coverImagePublicId);
      }
    }

    // Only update provided fields
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;

    if (uploadedProfile) {
      updateData.profilePicture = uploadedProfile.secure_url;
      updateData.profilePicturePublicId = uploadedProfile.public_id;
    }

    if (uploadedCover) {
      updateData.coverImage = uploadedCover.secure_url;
      updateData.coverImagePublicId = uploadedCover.public_id;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user._id;

    // User Details
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User Posts
    const posts = await Post.find({ createdBy: id })
      .populate("createdBy", "firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName lastName profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    // Friends
    const friendsData = await Friend.find({
      status: "accepted",
      $or: [{ sender: id }, { reciever: id }],
    })
      .populate("sender", "firstName lastName profilePicture")
      .populate("reciever", "firstName lastName profilePicture");

    const friends = friendsData.map((friend) =>
      friend.sender._id.equals(id) ? friend.reciever : friend.sender,
    );

    // Friend Status
    const relation = await Friend.findOne({
      $or: [
        { sender: loggedInUser, reciever: id },
        { sender: id, reciever: loggedInUser },
      ],
    });

    let friendStatus = "none";

    if (relation) {
      if (relation.status === "accepted") {
        friendStatus = "accepted";
      } else if (
        relation.status === "pending" &&
        relation.sender.equals(loggedInUser)
      ) {
        friendStatus = "pending";
      } else if (
        relation.status === "pending" &&
        relation.reciever.equals(loggedInUser)
      ) {
        friendStatus = "received";
      }
    }

    return res.status(200).json({
      success: true,
      user,
      posts,
      friends,
      friendStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { updateProfile, getUserProfile };
