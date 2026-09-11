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
  getMyPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadCoverPicture from "../controllers/coverPictureController.js";
import uploadProfilePicture from "../controllers/profilePictureController.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getPendingConnections,
  getConnections,
  getTimeline,
  getUserById,
} from "../controllers/userController.js";
import { uploadPostPicture } from "../controllers/postImageController.js";
import {
  profilePicture,
  coverPicture,
  storyMedia,
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
  viewStory,
  getStoryViewers,
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
router.get("/users/me/posts", authMiddleware, getMyPosts);
router.get("/users/:userId/posts", authMiddleware, getUserPosts);
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
router.post(
  "/stories",
  authMiddleware,
  storyMedia.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 10 },
  ]),
  createStory,
);
router.get("/stories", authMiddleware, getStory);
router.get("/my-stories", authMiddleware, getMyStory);
router.get("/stories/:storyId", authMiddleware, viewStory);
router.get("/stories/:storyId/views", authMiddleware, getStoryViewers);
router.post("/users/:userId/follow", authMiddleware, followUser);
router.delete("/users/:userId/follow", authMiddleware, unfollowUser);
router.get("/users/followers", authMiddleware, getFollowers);
router.get("/users/following", authMiddleware, getFollowing);
router.get("/users/search", authMiddleware, searchUsers);
router.get("/users/pending-connections", authMiddleware, getPendingConnections);
router.get("/users/connections", authMiddleware, getConnections);
router.get("/users/timeline", authMiddleware, getTimeline);
router.get("/users/:userId", authMiddleware, getUserById);
export default router;
