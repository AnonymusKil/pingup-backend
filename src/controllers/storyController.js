import storyModel from "../models/storyModel.js";
import userModel from "../models/usermodel.js";
import postStoryMediaToCloudinary from "../helpers/storyCloudinaryHelper.js";
async function createStory(req, res) {
  try {
    const { content } = req.body;
    const imageFiles = req.files?.images || [];
    const videoFiles = req.files?.videos || [];
    if (!content && imageFiles.length === 0 && videoFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Story must contain text or an image, or a video",
      });
    }
    let uploadedImages = [];
    if (imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        imageFiles.map(async (file) => {
          const { url, publicId } = await postStoryMediaToCloudinary(file.path);
          return { url, publicId };
        }),
      );
    }
    let uploadedVideos = [];
    if (videoFiles.length > 0) {
      uploadedVideos = await Promise.all(
        videoFiles.map(async (file) => {
          const { url, publicId } = await postStoryMediaToCloudinary(file.path);
          return { url, publicId };
        }),
      );
    }
    const userId = req.userInfo.userId;
    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    const newStory = new storyModel({
      content,
      videos: uploadedVideos,
      images: uploadedImages,
      expiresAt: expiryTime,
      author: userId,
    });
    await newStory.save();
    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      story: newStory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function getStory(req, res) {
  try {
    const userId = req.userInfo.userId;
    const findUserId = await userModel.findById(userId).populate("following");
    if (!findUserId) {
      return res.status(404).json({
        success: false,
        message: "No story found for this user",
      });
    }
    const following = findUserId.following;
    const stories = await storyModel.find({
      author: { $in: following },
      expiresAt: { $gt: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "Stories retrieved successfully",
      stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function getMyStory(req, res) {
  try {
    const userId = req.userInfo.userId;
    const myStories = await storyModel.find({
      author: userId,
      expiresAt: { $gt: new Date() },
    });
    return res.status(200).json({
      success: true,
      message: "My stories retrieved successfully",
      myStories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function viewStory(req, res) {
  try {
    const userId = req.userInfo.userId;
    const storyId = req.params.storyId;
    const story = await storyModel.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }
    const alreadyViewed = story.views.some((id) => id.toString() === userId);
    if (!alreadyViewed) {
      story.views.push(userId);
    }
    await story.save();
    return res.status(200).json({
      success: true,
      message: "Story Viewed successfully",
      story,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function getStoryViewers(req, res) {
  try {
    const userId = req.userInfo.userId;
    const storyId = req.params.storyId;
    const story = await storyModel.findById(storyId).populate({
      path: "views",
      select: "firstName lastName userName profilePicture bio",
    });
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }
    if (story.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this story's viewers",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Story viewers retrieved successfully",
      views: story.views,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}
export { createStory, getStory, getMyStory, viewStory, getStoryViewers };
