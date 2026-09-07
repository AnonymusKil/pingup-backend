import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateUserProfile,
} from "../controllers/authController.js";
import {
  createPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadCoverPicture from "../controllers/coverPictureController.js";
import uploadProfilePicture from "../controllers/profilePictureController.js";
import { uploadPostPicture } from "../controllers/postImageController.js";
import {
  profilePicture,
  coverPicture,
} from "../middleware/uploadMiddleware.js";
import { likePost, unLike } from "../controllers/likeController.js";
import {
  addCommentToPost,
  editCommentToPost,
  deleteComment,
  likeComment,
  unlikeComment,
  getPostComments,
} from "../controllers/commentController.js";
import {
  createStory,
  getStory,
  getMyStory,
} from "../controllers/storyController.js";
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/ME", authMiddleware, getMe);
router.put("/userprofile", authMiddleware, updateUserProfile);
router.post(
  "/posts",
  authMiddleware,
  profilePicture.array("postPicture", 10),
  createPost,
);
router.get("/posts", authMiddleware, getAllPost);
router.get("/post/:postId", authMiddleware, getPostById);
router.put("/posts/updatePost/:postId", authMiddleware, updatePost);
router.delete("/post/:postId", authMiddleware, deletePost);

router.post(
  "/profile-picture",
  authMiddleware,
  profilePicture.single("profilePicture"),
  uploadProfilePicture,
);

router.post(
  "/cover-picture",
  authMiddleware,
  coverPicture.single("coverPicture"),
  uploadCoverPicture,
);
router.post("/posts/:postId/like", authMiddleware, likePost);
router.delete("/posts/:postId/unlike", authMiddleware, unLike);
router.post("/posts/:postId/comments", authMiddleware, addCommentToPost);
router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  editCommentToPost,
);
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  deleteComment,
);
router.post(
  "/posts/:postId/comments/:commentId/like",
  authMiddleware,
  likeComment,
);
router.delete(
  "/posts/:postId/comments/:commentId/unlike",
  authMiddleware,
  unlikeComment,
);
router.get("/posts/:postId/comments", authMiddleware, getPostComments);
router.post("/stories", authMiddleware, createStory);
router.get("/stories", authMiddleware, getStory);
router.get("/my-stories", authMiddleware, getMyStory);

export default router;
