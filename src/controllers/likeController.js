import { getIO, getOnlineUsers } from "../helpers/socketHelper.js";
import postModel from "../models/postmodel.js";
import notificationModel from "../models/notificationModel.js";
export async function likePost(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.userInfo.userId;
    const getPost = await postModel.findById(postId);
    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const alreadyliked = getPost.likes.some((id) => id.toString() === userId);
    if (alreadyliked) {
      return res.status(403).json({
        success: false,
        message: "You can't like post twice",
      });
    }
    getPost.likes.push(userId);
    await getPost.save();
    if (getPost.author.toString() !== userId) {
      const notification = await notificationModel.create({
        sender: userId,
        recipient: getPost.author,
        type: "LIKE_POST",
        postId,
      });
      const onlineUsers = getOnlineUsers();
      const io = getIO();
      const socketIds = onlineUsers.get(getPost.author.toString()); // Recipient may be offline
      if (socketIds) {
        socketIds.forEach((socketId) => {
          io.to(socketId).emit("notification", notification);
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to like post",
      error: error.message,
    });
  }
}

export async function unLike(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.userInfo.userId;
    const getPost = await postModel.findById(postId);
    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const alreadyliked = getPost.likes.some((id) => id.toString() === userId);
    if (!alreadyliked) {
      return res.status(400).json({
        success: false,
        message: "You have not like post ",
      });
    }
    const getLikes = getPost.likes.filter((id) => id.toString() !== userId);
    getPost.likes = getLikes;
    await getPost.save();
    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to unLike post",
      error: error.message,
    });
  }
}
