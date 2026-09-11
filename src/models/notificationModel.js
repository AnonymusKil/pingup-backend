import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    read: {
      type: Boolean,
      default: false,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostModel",
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ["FOLLOW", "LIKE_POST", "COMMENT", "LIKE_COMMENT"],
    },
  },
  { timestamps: true },
);

const notification = mongoose.model("NotificationModel", notificationSchema);
export default notification;
