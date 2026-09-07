import User from "../models/usermodel.js";
import uploadProfilePictureToCloudinary from "../helpers/profilePictureHelper.js";
import cloudinary from "../config/cloudinary.js";
export async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    console.log("File received:", req.file);

    const userId = req.userInfo.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldPublicId = user.profilePicture?.publicId;

    const { url, publicId } = await uploadProfilePictureToCloudinary(
      req.file.path,
    );

    user.profilePicture = { url, publicId };

    await user.save();

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.log("Error Uploading To Cloudinary", error);
    throw new Error("Error Uploading To Cloudinary");
  }
}

export default uploadProfilePicture;
