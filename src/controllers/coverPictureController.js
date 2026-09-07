import User from "../models/usermodel.js";
import uploadCoverPictureToCloudinary from "../helpers/coverPictureHelper.js";

export async function uploadCoverPicture(req, res) {
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

    const oldPublicId = user.coverPicture?.publicId;

    const { url, publicId } = await uploadCoverPictureToCloudinary(
      req.file.path,
    );

    user.coverPicture = { url, publicId };

    await user.save();

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    return res.status(200).json({
      success: true,
      message: "Cover picture updated successfully",
      user,
    });
  } catch (error) {
    console.log("Error Uploading To Cloudinary", error);
    throw new Error("Error Uploading To Cloudinary");
  }
}
export default uploadCoverPicture;
