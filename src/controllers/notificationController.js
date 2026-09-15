import notificationModel from "../models/notificationModel.js";
import userModel from "../models/usermodel.js";

async function getMyNotifications(req, res) {
  try {
    const getUser = req.userInfo.userId;

    const user = await userModel.findById(getUser).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notifications = await notificationModel.find({
      recipient: getUser,
    });

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve notifications",
      error: error.message,
    });
  }
}

async function markNotificationAsRead(req, res) {
  try {
    const notificationId = req.params.notificationId;
    const getNotifitication = await notificationModel.findById(notificationId);
    if (!getNotifitication) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    getNotifitication.read = true;
    await getNotifitication.save();
    
    return res.status(200).json({
      success: true,
      message: " notification marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve notifications",
      error: error.message,
    });
  }
}

async function markAllNotificationsAsRead(req, res) {
  try {
    const getUser = req.userInfo.userId;

    const user = await userModel.findById(getUser).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await notificationModel.updateMany(
      { recipient: getUser },
      { $set: { read: true } },
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to mark notifications as read",
      error: error.message,
    });
  }
}

async function deleteNotification(req, res) {
  try {
    const getUser = req.userInfo.userId;
    const notificationId = req.params.notificationId;

    const getNotification = await notificationModel.findById(notificationId);

    if (!getNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (getNotification.recipient.toString() !== getUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this notification",
      });
    }

    await notificationModel.findByIdAndDelete(notificationId);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete notification",
      error: error.message,
    });
  }
}
async function deleteAllNotifications(req, res) {
  try {
    const getUser = req.userInfo.userId;

    const user = await userModel.findById(getUser).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await notificationModel.deleteMany({ recipient: getUser });

    return res.status(200).json({
      success: true,
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete notifications",
      error: error.message,
    });
  }
}

export {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
   deleteAllNotifications
};
