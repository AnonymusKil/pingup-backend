import { getIO, getOnlineUsers } from "../helpers/socketHelper.js";
import notificationModel from "../models/notificationModel.js";
import postModel from "../models/postmodel.js";

async function addCommentToPost(req, res) {
  try {
    const postId = req.params.postId;
    const getPost = await postModel.findById(postId);
    const userId = req.userInfo.userId;

    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const newComment = getPost.comments.create({
      user: userId,
      content: content.trim(),
    });

    getPost.comments.push(newComment);

    await getPost.save();

    const notification = await notificationModel.create({
      sender: userId,
      recipient: getPost.author,
      type: "COMMENT",
      commentId: newComment._id,
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
    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      post: getPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add comment",
      error: error.message,
    });
  }
}

async function editCommentToPost(req, res) {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const getPost = await postModel.findById(postId);
    const userId = req.userInfo.userId;

    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    const comment = getPost.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment Not Found",
      });
    }
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this post",
      });
    }
    if (content !== undefined) comment.content = content;
    await getPost.save();
    return res.status(200).json({
      success: true,
      message: "Comment updated  successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error editing comment",
      error: error.message,
    });
  }
}

async function deleteComment(req, res) {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const getPost = await postModel.findById(postId);
    const userId = req.userInfo.userId;
    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    const comment = getPost.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment Not Found",
      });
    }
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }
    getPost.comments = getPost.comments.filter(
      (comment) => comment._id.toString() !== commentId,
    );
    await getPost.save();
    return res.status(200).json({
      success: true,
      message: "Comment Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Deleting comment",
      error: error.message,
    });
  }
}

async function likeComment(req, res) {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const getPost = await postModel.findById(postId);
    const userId = req.userInfo.userId;
    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    const comment = getPost.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment Not Found",
      });
    }
    const alreadyliked = comment.likes.some((id) => id.toString() === userId);
    if (alreadyliked) {
      return res.status(403).json({
        success: false,
        message: "You can't like comment twice",
      });
    }
    comment.likes.push(userId);
    await getPost.save();
    if (comment.user.toString() !== userId) {
      const notification = await notificationModel.create({
        sender: userId,
        recipient: comment.user,
        type: "LIKE_COMMENT",
        commentId,
        postId,
      });
      const onlineUsers = getOnlineUsers();
      const io = getIO();
      const socketIds = onlineUsers.get(comment.user.toString());
      if (socketIds) {
        socketIds.forEach((socketId) => {
          io.to(socketId).emit("notification", notification);
        });
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Comment liked successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error liking comment",
      error: error.message,
    });
  }
}

async function unlikeComment(req, res) {
  try {
    const postId = req.params.postId;
    const getPost = await postModel.findById(postId);
    const commentId = req.params.commentId;
    const userId = req.userInfo.userId;
    if (!getPost) {
      res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    const comment = getPost.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "comment Not Found",
      });
    }
    const alreadyLiked = comment.likes.some((id) => id.toString() === userId);
    if (!alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "You have not like comment",
      });
    }
    const getLikes = comment.likes.filter((id) => id.toString() !== userId);
    comment.likes = getLikes;
    await getPost.save();
    return res
      .status(200)
      .json({ success: true, message: "Comment unliked successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to unLike comment",
      error: error.message,
    });
  }
}

async function getPostComments(req, res) {
  try {
    const postId = req.params.postId;
    const getPost = await postModel.findById(postId).populate("comments.user");
    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    const comments = getPost.comments;
    return res.status(200).json({
      success: true,
      message: "Getting post comments successfully",
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occured getting post message",
      error: error.message,
    });
  }
}

export {
  addCommentToPost,
  editCommentToPost,
  deleteComment,
  likeComment,
  unlikeComment,
  getPostComments,
};
