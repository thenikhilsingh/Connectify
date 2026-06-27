const User = require("../models/user");
const { uploadOnCloudinary, cloudinary } = require("../utils/cloudinary");

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

module.exports = { updateProfile };
