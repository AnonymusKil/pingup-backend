import storyModel from "../models/storyModel.js";
import userModel from "../models/usermodel.js";
async function createStory(req, res) {
  try {
    const { content, image, video } = req.body;
    if (!content && !image && !video) {
      return res.status(400).json({
        success: false,
        message: "Story must contain text or an image, or a video",
      });
    }
    const userId = req.userInfo.userId;
    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    const newStory = new storyModel({
      content,
      videos: video,
      images: image,
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


async function getMyStory(req,res){
  try{
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
  }catch(error){
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

export { createStory, getStory, getMyStory };