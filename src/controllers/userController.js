import userModel from "../models/usermodel";
import postModel from "../models/postmodel";
async function followUser(req, res) {
  try {
    const userId = req.userInfo.userId;
    const targetUserId = req.params.userId;
    const findUser = await userModel.findById(userId);
    const findTargetUserId = await userModel.findById(targetUserId);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }
    if (!findTargetUserId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (targetUserId === userId) {
      return res.status(403).json({
        success: false,
        message: "You can't follow yourself",
      });
    }
    const checkduplicate = findUser.following.some(
      (id) => id.toString() === targetUserId,
    );
    if (checkduplicate) {
      return res.status(403).json({
        success: false,
        message: "You can't follow same user twice",
      });
    }
    findUser.following.push(targetUserId);
    findTargetUserId.followers.push(userId);

    await findUser.save();
    await findTargetUserId.save();

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function unfollowUser(req, res) {
  try {
    const userId = req.userInfo.userId;
    const targetUserId = req.params.userId;
    const findUser = await userModel.findById(userId);
    const findTargetUserId = await userModel.findById(targetUserId);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }
    if (!findTargetUserId) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const checkifuserfollowthem = findUser.following.some(
      (id) => id.toString() === targetUserId,
    );
    if (!checkifuserfollowthem) {
      return res.status(403).json({
        success: false,
        message: "You ARE NOT FOLLOWING USER",
      });
    }
    const updatedFollowing = findUser.following.filter(
      (id) => id.toString() !== targetUserId,
    );
    const updatedFollowers = findTargetUserId.followers.filter(
      (id) => id.toString() !== userId,
    );
    findUser.following = updatedFollowing;
    findTargetUserId.followers = updatedFollowers;
    await findUser.save();
    await findTargetUserId.save();
    return res
      .status(200)
      .json({ success: true, message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function getFollowers(req, res) {
  try {
    const userId = req.userInfo.userId;
    const findUser = await userModel.findById(userId).populate("followers");
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }
    const followers = findUser.followers;
    return res.status(200).json({
      success: true,
      message: "Followers retrieved successfully",
      followers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function getFollowing(req, res) {
  try {
    const userId = req.userInfo.userId;
    const findUser = await userModel.findById(userId).populate("following");
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }
    const following = findUser.following;
    return res.status(200).json({
      success: true,
      message: "Following users retrieved successfully",
      following,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function searchUsers(req, res) {
  try {
    const searchQuery = req.query.search;
    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "Search query can't be empty",
      });
    }
    const users = await userModel.find({
      $or: [
        { userName: { $regex: searchQuery, $options: "i" } },
        { firstName: { $regex: searchQuery, $options: "i" } },
        { lastName: { $regex: searchQuery, $options: "i" } },
      ],
    });
    res.status(200).json({
      success: true,
      message: "s",
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function getPendingConnections(req, res) {
  try {
    const userId = req.userInfo.userId;
    const findUser = await userModel.findById(userId).populate("following");

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    const following = findUser.following;

    const pendingConnection = following.filter((followingId) => {
      const check = findUser.followers.some(
        (id) => id.toString() === followingId._id.toString(),
      );

      return !check;
    });
    return res.status(200).json({
      success: true,
      message: "Pending connections retrieved successfully",
      pendingConnections: pendingConnection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}

async function getConnections(req, res) {
  try {
    const userId = req.userInfo.userId;
    const findUser = await userModel.findById(userId).populate("following");
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }
    const following = findUser.following;
    const connections = following.filter((followingId) => {
      const getConnections = findUser.followers.some(
        (id) => id.toString() === followingId._id.toString(),
      );

      return getConnections;
    });
    return res.status(200).json({
      success: true,
      message: "Connections retrieved successfully",
      connections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}
async function getTimeline(req, res) {
  try {
    const userId = req.userInfo.userId;

    const findUser = await userModel.findById(userId).populate("following");
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }
    const following = findUser.following;
    const getFollowingPost = await postModel.find({
      author: { $in: following },
    }).sort({createdAt:-1});
    res.status(200).json({
      success: true,
      message: "Timeline retrieved successfully",
      getFollowingPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
}
export {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getPendingConnections,
  getConnections,
  getTimeline,
};
