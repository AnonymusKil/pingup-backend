import storyModel from "../models/storyModel.js";
import uploadStoryMediaToCloudinary from "../helpers/storyCloudinaryHelper.js";

export async function uploadStoryMedia(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image or video",
      });
    }
    const userId = req.userInfo.userId;
    const storyId = req.params.storyId;
    if (!storyId) {
      return res.status(400).json({
        success: false,
        message: "Story ID is required",
      });
    }
    const story = await storyModel.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    if (story.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this story",
      });
    }
    const uploadedMedia = await Promise.all(
      req.files.map(async (file) => {
        const { url, publicId } = await uploadStoryMediaToCloudinary(file.path);

        if (file.mimetype.startsWith("image/")) {
          story.images.push({ url, publicId });
        }
        if (file.mimetype.startsWith("video/")) {
          story.videos.push({ url, publicId });
        }
        return {
          url,
          publicId,
        };
      }),
    );
    await story.save();
    return res.status(200).json({
      success: true,
      message: "Story media uploaded successfully",
      story,
      uploadedMedia,
    });
  } catch (error) {
    console.log("Error Uploading Story Media:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading story media",
      error: error.message,
    });
  }
}
