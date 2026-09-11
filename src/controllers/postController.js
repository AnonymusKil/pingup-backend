import postModel from "../models/postmodel.js";
import postPictureToCloudinary from "../helpers/postImageHelper.js";
import userModel from "../models/usermodel.js";
import cloudinary from "../config/cloudinary.js";

async function createPost(req, res) {
  try {
    const { content } = req.body;
    const imageFiles = req.files;
    if ((!content && imageFiles.length === 0) || (!content && !imageFiles)) {
      return res.status(400).json({
        success: false,
        message: "Post must contain text or an image",
      });
    }
    let uploadedImages = [];
    if (imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        imageFiles.map(async (file) => {
          const { url, publicId } = await postPictureToCloudinary(file.path);
          return { url, publicId };
        }),
      );
    }
    const userId = req.userInfo.userId;
    const newPost = new postModel({
      author: userId,
      content,
      image: uploadedImages,
    });
    await newPost.save();
    return res.status(201).json({
      success: true,
      message: "Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Posting Content",
      error: error.message,
    });
  }
}

async function getMyPosts(req, res) {
  try {
    const userId = req.userInfo.userId;
    const findUser = await userModel.findById(userId);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }
    const posts = await postModel.find({ author: userId });
    res.status(200).json({
      success: true,
      message: "User posts retrieved successfully",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve posts",
      error: error.message,
    });
  }
}
async function getUserPosts(req, res) {
  try {
    const getUser = req.params.userId;
    const user = await userModel.findById(getUser).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const posts = await postModel.find({ author: getUser });
     res.status(200).json({
      success: true,
      message: "User posts retrieved successfully",
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve posts",
      error: error.message,
    });
  }
}
async function getPostById(req, res) {
  try {
    const postId = req.params.postId;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve posts",
      error: error.message,
    });
  }
}

async function updatePost(req, res) {
  try {
    const { content } = req.body;
    const userId = req.userInfo.userId;
    const postId = req.params.postId;
    const getPost = await postModel.findById(postId);
    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    if (getPost.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this post",
      });
    }
    if (content !== undefined) getPost.content = content;
    await getPost.save();
    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      getPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve posts",
      error: error.message,
    });
  }
}

async function deletePost(req, res) {
  try {
    const userId = req.userInfo.userId;
    const postId = req.params.postId;
    const getPost = await postModel.findById(postId);
    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    if (getPost.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission",
      });
    }
    await Promise.all(
      getPost.image.map((image) => {
        return cloudinary.uploader.destroy(image.publicId);
      }),
    );
    await postModel.findByIdAndDelete(postId);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve posts",
      error: error.message,
    });
  }
}

export { createPost, getMyPosts, getPostById, updatePost, deletePost, getUserPosts };
